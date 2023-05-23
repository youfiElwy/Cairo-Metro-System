const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const pool = require("../connectors/db"); //import the databse file

//middleware
app.use(cors());
app.use(express.json());

// upme the admin id should come from the session
//create station
app.post("/station", async (req, res) => {
  try {
    const { description } = req.body; //reading the input from the json file
    const newStation = await pool.query(
      "Insert into station (lokation,description,admin_id) Values ($1,$2,$3)  ",
      ["location", description, 1]
    ); //  sql query
    res.json(newStation); //  to send a JSON response back to the client.
    //   res.send(newStation)
    console.log(newStation.rows); // just for debugging
  } catch (error) {
    console.error(error.message);
  }
});

// upme the admin id should come from the session
// upme change description to name
//update station
app.put("/station/:id", async (req, res) => {
  try {
    const { id } = req.params; //station id is the station name
    const { description } = req.body;
    const update_station = await pool.query(
      "update station set description =$1 where station_id = $2", //sql query
      [description, id]
    ); // sql query
    res.json("statoin updated"); // to return the res to user
    //console.log(update_tod.rows[0]); // for debugging
  } catch (error) {
    console.error(error.message);
  }
});

//delete station
app.delete("/station/:id", async (req, res) => {
  try {
    const { id } = req.params; //station name    (not the id ) bec. it makes sense to send the name not the id
    await pool.query("delete  from station station description = $1", [id]); // sql query
    const nodeSet = new Set();
    const [{ count }] = (await pool.query(`SELECT COUNT(*) FROM route;`)).rows;
    for (let i = 1; i <= count; i++) {
      let result = await pool.query("select * from route where route_id = $1", [
        i,
      ]);
      let origin_station = result.rows.map((row) => row.origin)[0];
      let destination_station = result.rows.map((row) => row.destination)[0];
      if (origin_station === id) {
        await pool.query("delete  from route where route_id = $1", [i]);
        nodeSet.add(origin_station);
      }
      if (destination_station === id) {
        await pool.query("delete  from route where route_id = $1", [i]);
        nodeSet.add(destination_station);
      }
    }
    let cnt = 151;
    for (i of nodeSet) {
      for (j of nodeSet) {
        if (i !== j) {
          await pool.query("Insert into route Values ($1,$2,$3,$4)  ", [
            cnt++,
            i,
            j,
            1,
          ]);
          await pool.query("Insert into route Values ($1,$2,$3,$4)  ", [
            cnt++,
            j,
            i,
            1,
          ]);
        }
      }
    }
    rerun_pricing_algo();
    res.json("deleted "); // to return the res to user
  } catch (error) {
    console.error(error.message);
  }
});

// app.listen(3000, () => {
//   console.log("server has started on port 3000 http://localhost:3000/station");
// });
//function calls

// function logic

// start of Db loading  ------------------------------------------------------------------------
const {
  floydWarshall,
  getShortestPaths,
  s1,
  numEdges,
  shortestPaths,
  mp,
  vp,
} = require("./pricing_alog.js");
const { log } = require("console");

async function loadStationDB() {
  // first insert the staions
  for (let i = 0; i < vp.length; i++)
    await pool.query("Insert into station  Values ($1,$2,$3) ", [
      "location",
      vp[i][1],
      1,
    ]);
  pricing_algorithm();
}
//pricing_algorithm()
async function emptyTable() {
  try {
    await pool.query("DELETE FROM all_possible_pathes");
  } catch (error) {
    console.error("Error emptying table:", error);
  }
}

async function pricing_algorithm() {
  emptyTable();
  //console.log(numEdges.length);
  for (let i = 0; i < numEdges.length; i++) {
    for (let j = 0; j < numEdges.length; j++) {
      if (i == j) continue;
      await pool.query(
        "Insert into all_possible_pathes  Values ($1,$2,$3,$4)  ",
        [vp[i][1], vp[j][1], numEdges[i][j], shortestPaths[i][j]]
      );
    }
  }
  console.log("done");
}
// end  of Db loading  ------------------------------------------------------------------------

// rerun pricing  on new matrix
rerun_pricing_algo();
async function rerun_pricing_algo() {
  const adjMatrix2 = updating_the_matrix();
  getShortestPaths(floydWarshall(adjMatrix2));
  pricing_algorithm();
}

// UPDATE THE MATRIX
async function updating_the_matrix() {
  const { rows } = await pool.query(`SELECT COUNT(*) FROM station;`);
  const size = rows[0].count; // 74
  console.log(size);

  // why wrong ????????????????
  //   const adjMatrix2 = new Array(size);
  //   for (let i = 0; i < adjMatrix2.length; i++) {
  //     adjMatrix2[i] = new Array(size).fill(false);
  //   }

  const adjMatrix2 = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      adjMatrix2[i][j] = false;
    }
  }
  //  console.log(adjMatrix2);

  const [{ count }] = (await pool.query(`SELECT COUNT(*) FROM route;`)).rows;
  for (let i = 1; i <= count; i++) {
    // get stations names

    let result = await pool.query("select * from route where route_id = $1", [
      i,
    ]);
    let origin_station = result.rows.map((row) => row.origin)[0];
    let destination_station = result.rows.map((row) => row.destination)[0];
    // console.log(origin_station);
    // console.log(destination_station);

    // convert name to id
    const { rows: originRows } = await pool.query(
      "SELECT station_id FROM station WHERE description = $1;",
      [origin_station]
    );
    const origin_station_id = originRows[0].station_id;

    const { rows: destinationRows } = await pool.query(
      "SELECT station_id FROM station WHERE description = $1;",
      [destination_station]
    );
    const destination_station_id = destinationRows[0].station_id;

    // console.log(origin_station_id);
    // console.log(destination_station_id);

    adjMatrix2[origin_station_id][destination_station_id] = true;
    adjMatrix2[destination_station_id][origin_station_id] = true;
  }
  //   console.log(adjMatrix2);
  return adjMatrix2;
}
loadStationDB();

updating_the_matrix();
module.exports = { rerun_pricing_algo };
