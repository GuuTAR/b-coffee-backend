const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();



//10--------------------------------------------------------------------------------
Router.get('/menu/:branchId', (req, res) => {
    let branchId = req.params.branchId;
    if (branchId == "all") {
      mysqlConnection.query(
        `SELECT imgUrl, menu_id, name, type, price, ingredient FROM MENU`,
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
      mysqlConnection.query(
        `SELECT imgUrl, menu_id, name, type, price, ingredient FROM MENU natural join BRANCH_HAS_MENU where branch_id = ${branchId}`,
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
  });


//14--------------------------------------------------------------------------------
Router.delete("/delete/menu/:menuId/:branchId", (req, res) => {
    let branch_id = req.params.branchId
    let menu_id = req.params.menuId
    let qb = req.body;
    if (branch_id == "all") {
      mysqlConnection.query(
        `DELETE FROM MENU WHERE menu_id= ${menu_id} `,
        [req.params.id],
        (err, results, fields) => {
          if (!err) {
            res.send("The selected quarterback has been successfully deleted.");
          } else {
            console.log(err);
          }
        }
      );
    }
    else {
      mysqlConnection.query(
        `DELETE FROM BRANCH_HAS_MENU WHERE menu_id= ${menu_id} and branch_id = ${branch_id} `,
        [req.params.id],
        (err, results, fields) => {
          if (!err) {
            res.send("The selected quarterback has been successfully deleted.");
          } else {
            console.log(err);
          }
        }
      );
    }
  });

module.exports = Router;