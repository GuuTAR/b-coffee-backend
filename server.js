const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const customerRoutes = require("./routes/customer");
const employeeRoutes = require("./routes/employee");
const orderRoutes = require("./routes/order");
const branchRoutes = require("./routes/branch");
const menuRoutes = require("./routes/menu");
const inventoryRoutes = require("./routes/inventory");

const app = express();

app.use(bodyParser.json());

// app.use(customerRoutes);
// app.use(employeeRoutes);
// app.use(orderRoutes);
app.use(branchRoutes);
// app.use(menuRoutes);
// app.use(inventoryRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Ahoy!' })
  })

app.listen(8080);