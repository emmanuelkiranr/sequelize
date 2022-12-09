// import the functions exported from userController
import express from "express";
import passengerController from "./controller/passengerController.js";
import qs from "querystring";

const app = express();
app.listen(3000);

app.get("/passenger/create", (req, res) => {
  res.end(passengerController.create);
});

app.get("/passenger/get", (req, res) => {
  res.end(passengerController.getAll);
});

app.post("/passenger/search", (req, res) => {
  // use postman
  // since we need the id query from the request url so that we can parse it and get the id, we can only get it via
  // an form input provided the form method is post or use postman. If we put get method and send req from browser
  // it wont work, since get method doesnt put query while sending response, and it returns undefined
  let formData = "";
  req.on("data", (data) => {
    formData += data;
  });
  req.on("end", () => {
    console.log("req reached");
    let query = qs.parse(formData);
    console.log(query);
    console.log(query.id);
    res.end(passengerController.search(query.id));
  });
});
