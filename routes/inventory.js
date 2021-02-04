const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//7--------------------------------------------------------------------------
Router.get("/inventory/:branchId", (req, res) => {
    let branch_id = req.params.branchId;
    mysqlConnection.getConnection((err, con)=> {
      if (err) {
        console.log(err);
      }
      else {
        if (branch_id == "all") {
          con.query(
            `SELECT item_id, name, branch_id, amount, unit FROM INVENTORY`,
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
            `SELECT item_id, name, branch_id, amount, unit FROM INVENTORY where branch_id = ${branch_id}`,
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
  
  //8-------------------------------------------------------------------
  Router.put("/inventory/update/:branchId/:itemId", (req, res) => {
    let branch_id = req.params.branchId
    let item_id = req.params.itemId
    let newAmount = req.body.amountItem;
    const sql =
      "SET @item_id = ?;SET @branch_id = ?;SET @newAmount = ?;CALL updateAmountInventory(@item_id, @branch_id, @newAmount)";
    mysqlConnection.getConnection((err, con)=> {
      if (err) {
        console.log(err);
      }
      else {
        con.query(
          sql,
          [
            item_id,
            branch_id,
            newAmount
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
      }
    })
  });
module.exports = Router;