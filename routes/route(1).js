const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const db = require("../connectors/db"); //import the databse file

//middleware
app.use(cors());
app.use(express.json());

// module.exports = { loadRouteDB };

//start http requests
//creat route
const getUser = require("../routes/public/get_user");
module.exports = function (app) {
  const { rerun_pricing_algo } = require("./station.js");

  app.post("/route", async (req, res) => {
    try {
      const userInfo = await getUser(req);

      const admin_id = userInfo.user_id;

      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { origin, destination, name } = req.body;
      // check if there wa a route before

      const found = (await db("route").where({ origin, destination }).select())
        .length;
      console.log(found);
      if (found === 1) {
        res.status(400).send("This route already exists");
      }

      const found2 = await db
        .count("*")
        .from("station")
        .where({ description: origin });
      if (found2 === 0) {
        res.status(400).send("This origin station does not exist");
      }

      const found3 = await db
        .count("*")
        .from("station")
        .where({ description: destination });
      if (found3 === 0) {
        res.status(400).send("This destination station does not exist");
      }

      //prevent  from adding root between the same station
      if (origin == destination) {
        res.status(400).send("You Can't add an edge between the same nodes");
      }

      const newRoute = await db("route")
        .insert({ origin, destination, name, admin_id })
        .returning("*");
      res.json(newRoute);
      rerun_pricing_algo();
      //   res.send(newStation)
    } catch (error) {
      console.error(error.message);
    }
  });

  // update route

  app.put("/route", async (req, res) => {
    try {
      const userInfo = await getUser(req);

      const admin_id = userInfo.user_id;

      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { origin, destination, name: new_name } = req.body;
      // check if there wa a route before
      const found = await db("route").where({ origin, destination }).first();

      if (!found) {
        return res.status(400).send("This route does not exist");
      }

      const updatedRoute = await db("route")
        .where({ origin, destination })
        .update({ name: new_name, admin_id: admin_id })
        .returning("*");

      res.json(updatedRoute);
    } catch (error) {}
  });
  //delete route

  //// here i changed alot of stuffs than need in the requiremnet ------------------------
  app.delete("/route", async (req, res) => {
    try {
      const userInfo = await getUser(req);
      if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
        return res.status(400).send("Error you are not an admin");
      }
      const { origin, destination } = req.body;
      // check if there wa a route before
      const found = await db("route").where({ origin, destination }).first();

      if (!found) {
        return res.status(400).send("This route does not exist");
      }

      await db("route").where({ origin, destination }).del();

      rerun_pricing_algo();

      res.send("Route deleted successfully");
    } catch (error) {
      console.error(error.message);
    }
  });
};

// loadRouteDB();
// function logic

//end http requests

// loadRouteDB();
// console.log("route done")
