const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../../../connectors/db"); //import the databse file

app.use(cors());
app.use(express.json());
const getUser = require("../../public/get_user");
module.exports = function (app) {
  app.get("/zones", async (req, res) => {
    const userInfo = await getUser(req);

    if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
      return res.status(400).send("Error you are not an admin");
    }
    try {
      const zone = await db("zones");
      res.status(200).json([200, zone]);
    } catch (error) {
      res.status(500).json([200, "error: Internal server error"]);
    }
  });

  app.put("/zones/:id", async (req, res) => {
    const userInfo = await getUser(req);

    const adminId = userInfo.user_id;

    if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
      return res.status(400).send([400, "Error you are not an admin"]);
    }
    const zoneId = req.params.id;
    const { price } = req.body;

    try {
      const updatedZone = await db("zones")
        .where("zone_id", zoneId)
        .update({ price })
        .returning("*");
      updatedZone;
      res.json([200, "Zone price Updated"]);

    } catch (error) {
      res.status(500).json([200, "error: Internal server error"]);
    }
  });
};
