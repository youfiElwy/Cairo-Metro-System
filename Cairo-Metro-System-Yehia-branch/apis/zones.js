const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../connectors/db");

app.use(cors());
app.use(express.json());

app.get("/zones/:id", async (req, res) => {
  const { id: zoneId } = req.params;

  try {
    const zone = await db("zones").where("zone_id", zoneId).first();
    if (!zone) {
      res.status(404).json({ error: "Zone not found" });
    } else {
      res.json(zone);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/zones/:id", async (req, res) => {
  const zoneId = req.params.id;
  const { price } = req.body;

  try {
    const updatedZone = await db("zones")
      .where("zone_id", zoneId)
      .update({ price })
      .returning("*");

    if (updatedZone.length === 0) {
      res.status(404).json({ error: "Zone not found" });
    } else {
      res.json(updatedZone[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


