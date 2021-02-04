const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//9-------------------------------------------------------------------------------
Router.get("/branch", (req, res) => {res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'DELETE'); // If needed
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      mysqlConnection.getConnection((err, con)=> {
        if (err) {
          console.log(err);
        }
        else {
          con.query(
            `SELECT ORDERT.branch_id, BRANCH.street, topspender_b(ORDERT.branch_id) as top_spender, 
            sum(price*amount) as income, (select CUSTOMER.name
                            from ORDERT natural join ORDERLINE natural join MENU, CUSTOMER
                            where ORDERT.customer_id = CUSTOMER.customer_id
                            group by CUSTOMER.name
                            order by sum(price*amount) desc limit 1) as topAll
          FROM ORDERT natural join ORDERLINE natural join MENU, BRANCH
          where ORDERT.branch_id = BRANCH.branch_id
          group by branch_id;`,
            (err, results, fields) => {
              if (!err) {
                res.send(results);
              } else {
                console.log(err);
              }
            }
          );
        }
      })
      // mysqlConnection.query(
      //   `SELECT ORDERT.branch_id, BRANCH.street, topspender_b(ORDERT.branch_id) as top_spender, 
      //   sum(price*amount) as income, (select CUSTOMER.name
      //                   from ORDERT natural join ORDERLINE natural join MENU, CUSTOMER
      //                   where ORDERT.customer_id = CUSTOMER.customer_id
      //                   group by CUSTOMER.name
      //                   order by sum(price*amount) desc limit 1) as topAll
      // FROM ORDERT natural join ORDERLINE natural join MENU, BRANCH
      // where ORDERT.branch_id = BRANCH.branch_id
      // group by branch_id;`,
      //   (err, results, fields) => {
      //     if (!err) {
      //       res.send(results);
      //     } else {
      //       console.log(err);
      //     }
      //   }
      // );
  });

  module.exports = Router;