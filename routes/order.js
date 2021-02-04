const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();


//3------------------------------------------------------------------
Router.get("/all/order/:branchId/:date", (req, res) => {
  let branchId = req.params.branchId;
  let date = req.params.date;
  if (date == "" && branchId == "all") {
    mysqlConnection.query(
      `select order_id ,customer_id,created_at, branch_id,emp_id,totalprice(order_id) as totalpriceb From ORDERT natural join ORDERLINE natural join MENU group by order_id`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  }
  else if (date != "" && branchId == "all") {
    mysqlConnection.query(
      `select order_id ,customer_id,created_at, branch_id,emp_id,totalprice(order_id) as totalpriceb From ORDERT natural join ORDERLINE natural join MENU where created_at between "${date} 00:00:00" and "${date} 23:59:59" group by order_id`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  }
  else { //filter both date and branchId
    mysqlConnection.query(
      `select order_id ,customer_id,created_at, branch_id,emp_id,totalprice(order_id) as totalpriceb From ORDERT natural join ORDERLINE natural join MENU where branch_id = "${branchId}" and created_at between "${date} 00:00:00" and "${date} 23:59:59" group by order_id`,
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

Router.get("/orderline/:orderId", (req, res) => {
  let order_id = req.params.orderId;
  console.log(order_id)
  mysqlConnection.query(
    `select  M.name, amount, O.amount*M.price as price 
    from ORDERLINE O, MENU M 
    where O.menu_id = M.menu_id and O.order_id = "${order_id}";`,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    }
  );
});

//5-------------------------------------------------------------------
Router.post("/post/order", (req, res) => {
  let qb = req.body;
  let bill = req.body.bill
  var orderId
  const sql =
    "SET @customer_id = ?;SET @branch_id = ?;SET @emp_id = ?;CALL placeOrder(@customer_id, @branch_id, @emp_id)";
  mysqlConnection.query(
    sql,
    [
      qb.customerId,
      qb.branchId,
      qb.currentEmployee
    ],
    (err, results, fields) => {
      if (!err) {
        results.forEach((element) => {
          if (element.constructor == Array) {
            res.send(element);
            orderId = JSON.stringify(element[0]["max(order_id)"])
            orderLine(orderId, bill)
          }
        });
      } else {
        console.log(err);
      }
    }
  );
});

const orderLine = (orderId, bill) => {
  bill.forEach((orderLine) => {
    const sql =
      "SET @order_id = ?;SET @menu_id = ?;SET @amount = ?;CALL placeOrderline(@order_id, @menu_id, @amount)";
    mysqlConnection.query(
      sql,
      [
        orderId,
        orderLine.menu_id,
        orderLine.amount
      ],
      (err, results, fields) => {
        if (!err) {
        } else {
          console.log(err);
        }
      }
    );
  })
}

Router.post("/post/orderline", (req, res) => {
  let order_id = req.body.orderId;
  let menu_id = req.body.menuId;
  let amount = req.body.amount;
  const sql =
    "SET @order_id = ?;SET @menu_id = ?;SET @amount = ?;CALL placeOrderline(@order_id, @menu_id, @amount)";
  mysqlConnection.query(
    sql,
    [
      order_id,
      menu_id,
      amount
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
});

//6--------------------------------------------------------------------------
Router.get("/order/:orderId", (req, res) => {
  let order_id = req.params.orderId;
  mysqlConnection.query(
    `select order_id, menu_id, amount, name, imgUrl, price, price*amount as eachPrice, totalprice(order_id) as totalpriceb  from ORDERLINE natural join MENU  where order_id = "${order_id}" and ORDERLINE.menu_id = MENU.menu_id`,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    }
  );
});

Router.put("/update/orderline/:orderId/:menuId", (req, res) => {
  let order_id = req.params.orderId
  let menu_id = req.params.menuId
  let newAmount = req.body.amount;
  const sql =
    "SET @order_id = ?;SET @menu_id = ?;SET @newAmount = ?;CALL updateAmountOrderline(@order_id, @menu_id, @newAmount)";
  mysqlConnection.query(
    sql,
    [
      order_id,
      menu_id,
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
});

Router.delete("/delete/orderline/:orderId/:menuId", (req, res) => {
  let order_id = req.params.orderId
  let menu_id = req.params.menuId
  mysqlConnection.query(
    `DELETE FROM ORDERLINE WHERE order_id= ${order_id} and menu_id= ${menu_id} `,
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