// var ipx = require("./ipx")
var ip = require('./ip')

// ipx.load("/Users/maxu/Downloads/nodejs-master/17monipdb.dat")
ip.load(`${__dirname}/17monipdb.dat`)

module.exports = ip;
