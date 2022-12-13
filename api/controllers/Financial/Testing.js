const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getRouting = async (req, res) => {
  try {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Both Node and DB Servers are Up!!!");
        var object = {
          Status: "OK",
          Version: "1.1.0",
          NodeServer: "Node Server is up and running!",
          DBServer: "Database is up and running!",
        };
        res.status(200).send(object);
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
        var object = {
          Status: "FAILED",
          Version: "1.1.0",
          NodeServer: "Server is up and running!",
          DBServer: "Unable to connect to the database: " + err,
        };
        res.status(200).send(object);
      });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};
