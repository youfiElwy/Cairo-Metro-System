const { isEmpty } = require('lodash');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.put("/api/v1/payment/ticket/checkprice", async function (req, res) {
        const possibleRoute = await db
            .select("*")
            .from("all_possible_pathes")
            .where("origin", req.body.origin)
            .andWhere("destination", req.body.destination);

        if (isEmpty(possibleRoute)) {
            console.log(possibleRoute);
            return res.status(400).send([200,"Coulnd not get route from DB"]);
        }

        number_of_stations = possibleRoute[0].number_of_stations;
        let price = 100;
        let zone_id = 100;
        const zones = await db.select("*").from("zones");
        for (cur_zone of zones) {
            if (cur_zone.maximumstations >= number_of_stations) {
                price = Math.min(cur_zone.price, price);
                zone_id = Math.min(cur_zone.zone_id, zone_id);

                break;
            }
        }
        console.log(price);

        try {
            return res.status(200).send([200,`Ticket price is ${price}`]);
            // OR -------------------------------------
            //  return res.status(200).json({price});
            //  
        } catch (err) {
            console.log(err.message);
            return res.status(400).send([400,"Error: Could not enter data into database"]);
        }
    });
}