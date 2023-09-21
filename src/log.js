const fs = require("fs");
const util = require("util");

const logFile = fs.createWriteStream("./output.log", { flags: "w" });

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  process.stdout.write(util.format.apply(null, arguments) + "\n");
};
