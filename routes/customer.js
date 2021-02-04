const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//comit

 //11--------------------------------------------------------------------------------
 Router.get("/customer/:customerName", (req, res) => {
  let customer_name = req.params.customerName
  console.log(customer_name)
  mysqlConnection.getConnection((err, con)=> {
    if (err) {
      console.log(err);
    }
    else {
      if (customer_name == "none") {
        con.query(
          `SELECT customer_id, name, SSN, sex, birthdate, phone_no, memberpoint FROM CUSTOMER`,
          (err, results, fields) => {
            if (!err) {
              res.send(results);
              console.log(req.body);
            } else {
              console.log(err);
            }
          }
        );
      }
      else {
        con.query(
          `SELECT customer_id, name, SSN, sex, birthdate, phone_no, memberpoint FROM CUSTOMER WHERE name LIKE "${customer_name}%"`,
          (err, results, fields) => {
            if (!err) {
              res.send(results);
              console.log(req.body);
            } else {
              console.log(err);
            }
          }
        );
      }
    }
  })
});

 //12--------------------------------------------------------------------------------
 Router.post("/customer/add", (req, res) => {
  let qb = req.body;
  const sql =
    "SET @name = ?;SET @SSN = ?;SET @sex = ?;SET @birthdate = ?;SET @memberpoint = ?;SET @phone_no = ?;CALL AddCustomer(@name, @SSN, @sex, @birthdate, @memberpoint, @phone_no)";
  mysqlConnection.getConnection((err, con)=> {
    if (err) {
      console.log(err);
    }
    else {
      con.query(
      sql,
      [
        qb.name,
        qb.SSN,
        qb.sex,
        qb.birthdate,
        qb.memberpoint,
        qb.phone_no
      ],
      (err, results, fields) => {
        if (!err) {
          results.forEach((element) => {
            if (element.constructor == Array) res.send(element);
          });
        } else {
          console.log(err);
        }
      }
      );
    }
  })
});

 


module.exports = Router;





