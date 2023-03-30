const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Contracts = require("./database/escrow");
const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.get("/get", async (req, res) => {
  const response = await Contracts.find({});
  res.status(200).json(response);
});

app.post("/search", async (req, res) => {
  const params = req.body;
  console.log("Search params: ", params);

  const escrows = await Contracts.find({ $and: [params] });
  console.log(escrows);
  res.status(200).json(escrows);
});

app.post("/approve", async (req, res) => {
  const approve = req.body;
  const contract = await Contracts.find(approve);
  contract[0].isApproved = true;
  await contract[0].save();
  res.status(200).json(contract);
});

app.post("/add", async (req, res) => {
  const tmp = req.body;
  const contract = new Contracts(tmp);
  // console.log("Contract: ", contract);
  console.log(tmp);

  await contract.save();
  res.status(200).json(contract);
});

app.listen(PORT, () => {
  console.log("Listening at ", PORT);
  connect();
});
