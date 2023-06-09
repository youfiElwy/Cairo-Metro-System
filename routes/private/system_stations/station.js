const express = require("express"); //to impoert express
// const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y
const getUser = require("../../public/get_user");
module.exports = function (app) {
  const {
    floydWarshall,
    getShortestPaths,
    numEdges,
    shortestPaths,
    vp,
    stations,
  } = require("./pricing_alog.js");
  const db = require("../../../connectors/db"); //import the databse file

  // const { loadRouteDB } = require("./route.js");
  //middleware
  app.use(cors());
  app.use(express.json());

  async function emptyTable(tableName) {
    try {
      // Step 1: Delete all rows from the table
      await db.raw(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);

      // Step 2: Reset the sequence
      // const resetQuery = `ALTER SEQUENCE ${tableName}_${tableName}_id_seq RESTART WITH 1`;
      // await pool.query(resetQuery);

      console.log(` table '${tableName}' deleted successfully.`);
    } catch (error) {
      console.error("Error resetting serial ID:", error);
    }
  }

  // start the http requests

  // upme the admin id should come from the session
  //create station
  app.post("/station", async (req, res) => {
    try {
      const userInfo = await getUser(req);
      const admin_id = userInfo.user_id;

      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { description } = req.body;
      //check if it was posted before
      const found = (
        await db("station").where("description", description).select()
      ).length;

      if (found === 1) {
        res.status(400).send("This station is already exists ");
      }
      const newStation = await db("station").insert({
        lokation: "location",
        description,
        admin_id,
      });
      const insertedRow = await db("station")
        .where("description", description)
        .first();
      res.json(insertedRow);
    } catch (error) {
      console.error(error.message);
    }
  });

  // upme the admin id should come from the session
  //update station

  app.put("/station/:id", async (req, res) => {
    try {
      const userInfo = await getUser(req);
      const admin_id = userInfo.user_id;

      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { id: old_description } = req.params; //station id is the station name not id -**************-*-*-*
      const { description: new_description } = req.body;
      // check if the id is not valid
      const found = (
        await db("station").where("description", old_description).select()
      ).length;
      if (found === 0) {
        res.status(400).send("This id does NOT exist");
      }
      await db("station")
        .where("description", old_description)
        .update({ description: new_description, admin_id: admin_id });
      res.json("statoin updated");
    } catch (error) {
      console.error(error.message);
    }
  });

  //delete station
  app.delete("/station", async (req, res) => {
    try {
      const userInfo = await getUser(req);
      const admin_id = userInfo.user_id;

      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { description: target_station } = req.body; //station name
      if (!target_station) res.status(400).send("no description");
      //check if this id vaild
      const isValid = (
        await db("station").where("description", target_station).select()
      ).length;
      if (!isValid) {
        res.status(400).send("no valid station");
      }

      // now before  deleteing the station we need to connect it's edges to each other first
      // sql query

      const nodeSet = new Set();

      // get the route table

      const route = await db.select("*").from("route");
      //here we get all the stations that have edge with target station
      // and we delete the edge of the target station
      for (const { origin, destination } of route) {
        if (origin === target_station) {
          await db("route").where({ origin, destination }).del();
          nodeSet.add(destination);
        } else if (destination === target_station) {
          await db("route").where({ origin, destination }).del();
          nodeSet.add(origin);
        }
      }
      console.log(nodeSet);
      // now make edge between all the nodeSet elements
      for (const i of nodeSet) {
        for (const j of nodeSet) {
          if (i !== j) {
            const n = i + j + "line";
            console.log(i + " " + j);
            const found = await db("route")
              .where({ origin: i, destination: j })
              .select(db.raw("1"))
              .first();

            if (found) continue;

            await db("route").insert({
              origin: i,
              destination: j,
              admin_id: 1,
              name: n,
            });
          }
        }
      }

      db("station").where("description", target_station.description).del();
      await rerun_pricing_algo();

      res.json("deleted"); // to return the res to user
    } catch (error) {
      console.error(error.message);
    }
  });

  // end of the requests

  // start of Db loading  ------------------------------------------------------------------------

  // here

  // const { log } = require("console");
  // console.log(vp);
  async function loadStationDB() {
    await emptyTable("refund_request");
    await emptyTable("ride");
    await emptyTable("ticket");

    await emptyTable("station");
    // console.log(vp);

    for (let i = 0; i < vp.length; i++) {
      await db("station").insert({
        lokation: "location",
        description: vp[i][1],
        admin_id: 1,
      });
    }
    console.log("station tabled loaded");
    // await loadRouteDB();
    // await pricing_algorithm();
    // await loadRouteDB();
  }

  async function loadRouteDB() {
    await emptyTable("route");
    // first insert the staions
    for (let i = 1; i < stations.length; i++) {
      if (i !== 35 && i !== 55) {
        // If i isn't the last station in the 1st or the 2nd line, make an edge
        // We do this to prevent the last station in the 1st line from being connected to the first station in the 2nd line
        let nameForward = stations[i] + "_" + stations[i - 1] + "_Line";
        let nameBackward = stations[i - 1] + "_" + stations[i] + "_Line";

        await db("route").insert([
          {
            origin: stations[i],
            destination: stations[i - 1],
            name: nameForward,
            admin_id: 1,
          },
          {
            origin: stations[i - 1],
            destination: stations[i],
            name: nameBackward,
            admin_id: 1,
          },
        ]);
      }
    }
  }
  async function loadInserts() {
    await db("ticket").insert({
      // trans_id: 1,
      status: "active",
      trans_id: 1,
      user_id: 1,
      sub_id: 1,
      zone_id: 1,
      origin: "Helwan",
      destination: "Tora El-Asmant",
    });
    await db("ticket").insert({
      // trans_id: 1,
      status: "expired",
      trans_id: 1,
      user_id: 1,
      sub_id: 1,
      zone_id: 1,
      origin: "Helwan",
      destination: "Ain Helwan",
    });
    await db("ride").insert({
      status: "upcoming",
      start_time: "1999-01-08 04:05:06",
      end_time: "1999-01-08 04:05:06",
      ticket_id: 1,
    });
    await db("ride").insert({
      status: "in_progress",
      start_time: "1999-01-08 04:05:06",
      end_time: "1999-01-08 04:05:06",
      ticket_id: 2,
    });

    await db("refund_request").insert({
      request_state: "processing",
      description: "description",
      ticket_id: 1,
      admin_id: 1,
      user_id: 1,
    });

    await db("refund_request").insert({
      request_state: "processing",
      description: "description",
      ticket_id: 2,
      admin_id: 1,
      user_id: 2,
    });
  }
  //pricing_algorithm()

  async function pricing_algorithm() {
    await emptyTable("all_possible_pathes");
    // await db.raw('TRUNCATE TABLE all_possible_pathes RESTART IDENTITY CASCADE');

    // const lol = await db.select("*").from("all_possible_pathes")
    // console.log(lol)
    //console.log(numEdges.length);
    for (let i = 0; i < numEdges.length; i++) {
      for (let j = 0; j < numEdges.length; j++) {
        if (i == j) continue;

        // console.log( "meeeee     "+vp[i][1] +"  "+ vp[j][1]);
        await db("all_possible_pathes").insert({
          origin: vp[i][1],
          destination: vp[j][1],
          number_of_stations: numEdges[i][j],
          path: shortestPaths[i][j],
        });
      }
    }
  }
  // end  of Db loading  ------------------------------------------------------------------------

  // rerun pricing  on new matrix
  async function rerun_pricing_algo() {
    const adjMatrix2 = await updating_the_matrix();
    await getShortestPaths(await floydWarshall(adjMatrix2));
    await pricing_algorithm();
    console.log("The price has been updated !!");
  }

  // UPDATE THE MATRIX
  async function updating_the_matrix() {
    await emptyTable("all_possible_pathes");

    //new start
    // fill all stations into set then move to array to get elemnt by index
    const route = await db.select("*").from("route");
    const all_routes = new Set();
    for (const { origin, destination } of route) {
      all_routes.add(origin);
      all_routes.add(destination);
    }
    const currentStations = Array.from(all_routes);
    // console.log(currentStations);
    let size = currentStations.length;
    const adjMatrix2 = Array.from({ length: size }, () =>
      Array(size).fill(false)
    );
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        adjMatrix2[i][j] = false;
      }
    }

    for (const { origin, destination } of route) {
      let o_id = currentStations.indexOf(origin);
      let d_id = currentStations.indexOf(destination);
      // console.log(o_id+" "+d_id);
      adjMatrix2[o_id][d_id] = true;
      adjMatrix2[d_id][o_id] = true;
    }
    //   console.log(adjMatrix2);
    return adjMatrix2;
  }

  module.exports = { emptyTable, rerun_pricing_algo };

  // console.log("station done");

  // to call loadStationDB then rerun_pricing_algo at the same time use function start
  async function start() {
    await loadStationDB();
    await loadRouteDB();
    await pricing_algorithm();
    await loadInserts();
    console.log("start done");
  }
  // pricing_algorithm();
  start();
};
// emptyTable("all_possible_pathes")
// const checkPromisesStatus = () => {
//   for( l of promises)
//   {
//       console.log(l.isPending());
//   }
// };

// // Check the status of promises every second
// setInterval(checkPromisesStatus, 1000);
