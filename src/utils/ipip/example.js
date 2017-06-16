// var ipx = require("./ipx")
var ip = require("./ip")

// ipx.load("/Users/maxu/Downloads/nodejs-master/17monipdb.dat")
ip.load("/Users/maxu/Downloads/nodejs-master/17monipdb.dat")

console.log(ip.findSync("118.28.8.8"))
console.log(ip.findSync("1.245.178.131"))
console.log(ip.findSync("218.28.13.98"))
// console.log(ipx.findSync("118.28.8.8"))
// console.log(ipx.findSync("218.28.13.98"))
