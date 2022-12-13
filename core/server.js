require("dotenv").config();
const execSync = require("child_process").execSync;
const app = require("./app");
const settings = require("../AppConfig");
var os = require("os");
var ifaces = os.networkInterfaces();

const createDb = () => {
  return new Promise((resolve, reject) => {
    try {
      execSync("sequelize db:create", { stdio: "inherit" });
      resolve("OK");
    } catch (e) {
      reject(e);
    }
  });
};

const migrate = () => {
  return new Promise((resolve, reject) => {
    try {
      execSync("sequelize db:migrate", { stdio: "inherit" });
      resolve("OK");
    } catch (e) {
      reject(e);
    }
  });
};

app.listen(settings.webport, () => {
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        let ip = iface.address;
        console.log(
          "Both Node (Server (Wi-Fi) : http://" +
            ip +
            ":" +
            settings.webport +
            ") and DB Servers are Up!!!"
        );

        return;
      }
      if (alias <= 0) {
        if (ifname === "Ethernet") {
          let ip = iface.address;
          console.log(
            "Both Node (Server (Ethernet) : http://" +
              ip +
              ":" +
              settings.webport +
              ") and DB Servers are Up!!!"
          );
        } else if (ifname === "Wi-Fi") {
          let ip = iface.address;
          console.log(
            "Both Node (Server (Wi-Fi) : http://" +
              ip +
              ":" +
              settings.webport +
              ") and DB Servers are Up!!!"
          );
        }
      }
      ++alias;
    });
  });
});
