// require("dotenv").config();
// const express = require("express");
// const connectDB = require("../lib/db");

// const app = express();

// connectDB();
// app.use(express.json());

// app.use("/api/employees", require("./routes/employee.routes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
import dotenv from "dotenv";
import express from "express";
import connectDB from "../lib/db";
import employeeRoutes from "./routes/employee.routes.js";

dotenv.config();

const app = express();

connectDB();
app.use(express.json());

app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
