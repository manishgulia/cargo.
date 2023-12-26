const mysql = require("mysql");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"cargo"
})
connection.connect((err)=> {
    if (err) throw err;
    console.log("database bhi jud gya");
  });
  
  
  module.exports = connection;