const { isEmpty } = require("lodash");
const db = require("../../connectors/db");
const bodyParser = require("body-parser");
const getUser = require("../../routes/public/get_user");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.delete("/api/v1/users/logout", async function (req, res) {
    // LOGOUT
    try {
      const user = await getUser(req);
      const userId = user.user_id;

      const SessionEntry = await db
        .select("*")
        .from("sessions")
        .where("user_id", userId)
        .del()
        .returning("*");
      if (isEmpty(SessionEntry)) {
        return res
          .status(404)
          .send(
            "Something went wrong while logging out. Session Entry was not found in DB"
          );
      }
      return res.status(200).send("Logged out successfully");
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error: Something went wrong");
    }
  });
};
