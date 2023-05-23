const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const pool = require("../connectors/db"); //import the databse file

//middleware
app.use(cors());
app.use(express.json());

//creat route
const { rerun_pricing_algo } = require("./station.js");
app.post("/route", async (req, res) => {
  try {
    const { origin, destination, admin_id } = req.body; //reading the input from the json file
    const newStation = await pool.query(
      "Insert into route Values ($1,$2,$3,$4)  ",
      [151, origin, destination, admin_id]
    ); //  sql query
    res.json(newStation); //  to send a JSON response back to the client.
    rerun_pricing_algo();
    //   res.send(newStation)
    console.log(newStation.rows); // just for debugging
  } catch (error) {
    console.error(error.message);
  }
});

//delete route

app.delete("/route/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("delete  from route where route_id = $1", [id]); // sql query

    rerun_pricing_algo();

    res.json("deleted "); // to return the res to user
  } catch (error) {
    console.error(error.message);
  }
});

// loadRouteDB();
// function logic

async function loadRouteDB() {
  // first insert the staions
  const { mp, stations } = require("./pricing_alog.js");
  let id = 0;
  for (let i = 1; i < stations.length; i++) {
    if (i !== 34 + 1 && i !== 54 + 1) {
      //if  i isn't the last station in the 1st or the 2nd line so make edge  we did this to prevent the last station in the 1st be connected to the first station in the 2nd line
      id++;
      await pool.query("Insert into route  Values ($1,$2,$3,$4) ", [
        id,
        stations[i],
        stations[i - 1],
        1,
      ]);
      id++;
      await pool.query("Insert into route  Values ($1,$2,$3,$4) ", [
        id,
        stations[i - 1],
        stations[i],
        1,
      ]);
    }
  }
}

// app.listen(3000, () => {
//   console.log("server has started on port 3000 http://localhost:3000/station");
// });
