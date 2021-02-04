const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();


//1------------------------------------------------------------------
Router.get("/employee/:branchId", (req, res) => {
    let branch_id = req.params.branchId;
    if (branch_id == "all") {
      mysqlConnection.query(
        `SELECT emp_id, name, position, sex, birthdate, startDate, salary FROM EMPLOYEE`,
        (err, results, fields) => {
          if (!err) {
            res.send(results);
          } else {
            console.log(err);
          }
        }
      );
    }
    else {
      mysqlConnection.query(
        `SELECT emp_id, name, position, sex, birthdate, startDate, salary FROM EMPLOYEE where branch_id = ${branch_id}`,
        (err, results, fields) => {
          if (!err) {
            res.send(results);
          } else {
            console.log(err);
          }
        }
      );
    }
  });


  //2------------------------------------------------------------------
  Router.put("/update/position/:empId", (req, res) => {
    let emp_id = req.params.empId;
    let position = req.body.position;
    const sql =
      "SET @emp_id = ?;SET @position = ?;CALL updatePosition(@emp_id, @position)";
    mysqlConnection.query(
      sql,
      [
        emp_id,
        position,
      ],
      (err, results, fields) => {
        if (!err) {
          res.send(
            "The data for the selected quarterback has been successfully updated."
          );
        } else {
          console.log(err);
        }
      }
    );
  });

  //13------------------------------------------------------------------
  Router.delete("/delete/employee/:empId", (req, res) => {
    let emp_id = req.params.empId;
    mysqlConnection.query(
      `DELETE FROM EMPLOYEE WHERE emp_id= ${emp_id} `,
      [req.params.id],
      (err, results, fields) => {
        if (!err) {
          res.send("The selected quarterback has been successfully deleted.");
        } else {
          console.log(err);
        }
      }
    );
  });

module.exports = Router;