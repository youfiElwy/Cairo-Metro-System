const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const pool = require("../connectors/db"); //import the databse file

//middleware
app.use(cors());
app.use(express.json());
async function emptyTable(tableName) {
  try {
    // Step 1: Delete all rows from the table
    const deleteQuery = `DELETE FROM ${tableName}`;
    await pool.query(deleteQuery);

    // Step 2: Reset the sequence
    // const resetQuery = `ALTER SEQUENCE ${tableName}_${tableName}_id_seq RESTART WITH 1`;
    // await pool.query(resetQuery);

    // console.log(`Serial ID for table '${tableName}' reset successfully.`);
  } catch (error) {
    console.error("Error resetting serial ID:", error);
  }
}

// start the http requests

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
    // console.log(newS tation.rows); // just for debugging
  } catch (error) {
    console.error(error.message);
  }
});

// upme the admin id should come from the session
// upme change description to name
//update station
app.put("/station/:id", async (req, res) => {
  try {
    const { id } = req.params; //station id is the station name not id -**************-*-*-*
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
app.delete("/station", async (req, res) => {
  try {
    const { description: target_station } = req.body; //station name
    if (!target_station) res.status("400").message("no description");
    //check if this id vaild
    const isValid = await pool.query(
      "select *  from station where description  = $1",
      [target_station]
    ); // sql query
    if (isValid.rowCount === 0) {
      res.status("400").message("no valid station");
    }

    // now before  deleteing the station we need to connect it's edges to each other first
    // sql query

    const nodeSet = new Set();
    // const [{ count }] = (
    //   await pool.query(`SELECT MAX(route_id) as count FROM route;`)
    // ).rows;
    // console.log(count);

    // get the route table
    const { rows: route } = await pool.query("select * from route");
    //here we get all the stations that have edge with target station
    // and we delete the edge of the target station
    for (const { route_id, origin, destination } of route) {
      if (origin === target_station) {
        await pool.query("delete  from route where route_id = $1", [route_id]);
        nodeSet.add(destination);
      } else if (destination === target_station) {
        await pool.query("delete  from route where route_id = $1", [route_id]);
        nodeSet.add(origin);
      }
    }

    // now make edge between all the nodeSet elements
    for (i of nodeSet) {
      for (j of nodeSet) {
        if (i !== j) {
          console.log(i + " "+j);
          await pool.query(
            "Insert into route (origin,destination,admin_id) Values ($1,$2,$3)  ",
            [i, j, 1]
          );
        }
      } 
    }

    // // now we can delete the station safely
    await pool.query("delete  from station where description  = $1", [
      target_station,
    ]);
    // await rerun_pricing_algo();
    res.json("deleted"); // to return the res to user
  } catch (error) {
    console.error(error.message);
  }
});

// end of the requests

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
// const { log } = require("console");
// console.log(vp);
async function loadStationDB() {
  await emptyTable("station");
  // console.log(vp);

  for (let i = 0; i < vp.length; i++)
    await pool.query(
      "Insert into station (lokation,description,admin_id) Values ($1,$2,$3) ",
      ["location", vp[i][1], 1]
    );
  await pricing_algorithm();
}
//pricing_algorithm()

async function pricing_algorithm() {
  await emptyTable("all_possible_pathes");
  //console.log(numEdges.length);
  for (let i = 0; i < numEdges.length; i++) {
    for (let j = i + 1; j < numEdges.length; j++) {
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
async function rerun_pricing_algo() {
  const adjMatrix2 = await updating_the_matrix();
  await getShortestPaths(floydWarshall(adjMatrix2));
  await pricing_algorithm();
}

// UPDATE THE MATRIX
async function updating_the_matrix() {
  await emptyTable("all_possible_pathes");
  const { size } = await pool.query(
    `SELECT Max(station_id) as size FROM station;`
  ).rows;
  console.log(size);
  // console.log(size);

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

  const [{ count }] = (
    await pool.query(`SELECT Max(route_id) as count FROM route;`)
  ).rows;
  console.log(count);
  for (let i = 1; i <= count; i++) {
    // get stations names

    let result = await pool.query("select * from route where route_id = $1", [
      i,
    ]);
    if (result.rowCount === 0) continue;
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

module.exports = { emptyTable, rerun_pricing_algo };

//run functoins
console.log("station done");

// to call loadStationDB then rerun_pricing_algo at the same time use function start
async function start() {
  await loadStationDB();
  await rerun_pricing_algo();
}
// start();
app.listen(3000, () => {
  console.log("server has started on port 3000 http://localhost:3000/station");
});
//  loadStationDB();
// rerun_pricing_algo();
// emptyTable("station");

//extra
// async function getDataFromTable() {
//   try {
//     const query = 'SELECT * FROM route'; // Replace 'your_table_name' with the actual table name
//     const { rows } = await pool.query(query);

//     for (const row of rows) {
//       // Process each row here
//       const {route_id}=row
//       console.log(route_id); // Example: Log the row data

//       // You can perform additional operations or transformations here
//     }
//   } catch (error) {
//     console.error('Error fetching data from table:', error);
//   }
// }

// getDataFromTable();
