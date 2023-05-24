const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const pool = require("../connectors/db"); //import the databse file
//middleware
app.use(cors());
app.use(express.json());

const { rerun_pricing_algo, emptyTable } = require("./station.js");

//start http requests
//creat route

app.post("/route", async (req, res) => {
  try {
    const { origin, destination, name, admin_id } = req.body;
    // check if there wa a route before
    const found = (
      await pool.query(
        "select * from  route  where origin = $1 AND destination = $2 ",
        [origin, destination]
      )
    ).rowCount;
    if (found === 1) {
      res.status(400).send("This route is already exists ");
    }
    // check that's both origin and destination are valid stations
    const found2 = (
      await pool.query("select * from  station  where description = $1 ", [
        origin,
      ])
    ).rowCount;
    if (found2 === 0) {
      res.status(400).send("This origin station does NOT exists ");
    }
    const found3 = (
      await pool.query("select * from  station  where description = $1 ", [
        destination,
      ])
    ).rowCount;
    if (found3 === 0) {
      res.status(400).send("This destination station does NOT exists ");
    }
    //prevent  from adding root between the same station
    if (origin == destination) {
      res.status(400).send("You Can't add an edge between the same nodes");
    }
    const newStation = await pool.query(
      "Insert into route Values ($1,$2,$3,$4)  ",
      [origin, destination, name, admin_id]
    );
    res.json(newStation);
    rerun_pricing_algo();
    //   res.send(newStation)
  } catch (error) {
    console.error(error.message);
  }
});

// update route

app.put("/route", async (req, res) => {
  try {
    const { origin, destination, name: new_name } = req.body;
    // check if there wa a route before
    const found = (
      await pool.query(
        "select * from  route  where origin = $1 AND destination = $2 ",
        [origin, destination]
      )
    ).rowCount;
    if (found === 0) {
      res.status(400).send("This route Does NOT  exist ");
    }

    const newRoute = await pool.query(
      "update route   set name =$1 where   origin = $2 AND destination = $3 ",
      [new_name, origin, destination]
    );
    res.json(newRoute);
  } catch (error) {}
});
//delete route

//// here i changed alot of stuffs than need in the requiremnet ------------------------
app.delete("/route", async (req, res) => {
  try {
    const { origin, destination } = req.body;
    // check if there wa a route before
    const found = (
      await pool.query(
        "select * from  route  where origin = $1 AND destination = $2 ",
        [origin, destination]
      )
    ).rowCount;
    if (found === 0) {
      res.status(400).send("This route is does NOT exists ");
    }

    await pool.query("delete  from route where origin = $1 AND destination= $2 ", [
      origin,
      destination,
    ]); // sql query

    rerun_pricing_algo();

    res.json("deleted ");
  } catch (error) {
    console.error(error.message);
  }
});

// loadRouteDB();
// function logic

//end http requests

async function loadRouteDB() {
  await emptyTable("route");
  // first insert the staions
  const { mp, stations } = require("./pricing_alog.js");
  for (let i = 1; i < stations.length; i++) {
    if (i !== 34 + 1 && i !== 54 + 1) {
      //if  i isn't the last station in the 1st or the 2nd line so make edge  we did this to prevent the last station in the 1st be connected to the first station in the 2nd line
      let nameForwared = stations[i] + "_" + stations[i - 1] + "_Line";
      let nameBackwared = stations[i - 1] + "_" + stations[i] + "_Line";

      await pool.query("Insert into route  Values ($1,$2,$3,$4) ", [
        stations[i],
        stations[i - 1],
        nameForwared,
        1,
      ]);
      await pool.query("Insert into route  Values ($1,$2,$3,$4) ", [
        stations[i - 1],
        stations[i],
        nameBackwared,
        1,
      ]);
    }
  }
}
// loadRouteDB();
console.log("route done");
app.listen(3000, () => {
  console.log("server has started on port 3000 http://localhost:3000/station");
});
