const { isEmpty } = require("lodash");
const db = require("../../connectors/db");
const bodyParser = require("body-parser");
const getUser = require("../../routes/public/get_user");
const cors = require("cors");

module.exports = async function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Register HTTP endpoint to create new user
  app.get("/get_all_users", async function (req, res) {
    console.log("here");
    const userInfo = await getUser(req);
    const admin_id = userInfo.user_id;
    console.log(userInfo);
    if (!(userInfo.isSuperAdmin || userInfo.isAdmin)) {
      return res.status(400).send("Error you are not an admin");
    }

    // get users credentials from the JSON body

    const user = await db.select("*").from("users");
    if (isEmpty(user)) {
      return res.status(400).send("Database is empty");
    }
    return res.status(200).json(user);
  });
};
