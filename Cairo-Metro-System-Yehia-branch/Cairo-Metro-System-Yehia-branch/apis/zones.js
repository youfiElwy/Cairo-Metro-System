const express = require("express"); //to impoert express
const app = express(); //to use express funstions (post / get .. )
const cors = require("cors"); //to import cors to help us manpultaing differenet ports easi;y

const pool = require("../connectors/db"); //import the databse file
//middleware
app.use(cors());
app.use(express.json());
// Get the data of a zone by ID
app.get("/zones/:id", (req, res) => {
  const { id: zoneId } = req.params;

  pool.query(
    "SELECT * FROM zones WHERE zone_id = $1",
    [zoneId],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        res.status(500).json({ error: "Internal server error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Zone not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.put("/zones/:id", (req, res) => {
  const zoneId = req.params.id;
  const { price } = req.body;

  pool.query(
    "UPDATE zones SET price = $1 WHERE zone_id = $2 RETURNING *",
    [price, zoneId],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        res.status(500).json({ error: "Internal server error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Zone not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.listen(3000);
