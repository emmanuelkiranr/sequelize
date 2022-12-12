// import the functions exported from userController
import express from "express";
import passengerController from "./controller/passengerController.js";
// import driverController from "./controller/driverController.js";
import driverRoutes from "./routes/driverRoutes.js";
import parser from "body-parser";
import { engine } from "express-handlebars";
import qs from "querystring";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.listen(3000);

app.use("/", parser.urlencoded({ extended: true }));
// app.get("/passenger/create", (req, res) => {
//   res.end(passengerController.create);
// });
app.post("/passenger/create", (req, res) => {
  let formData = "";
  req.on("data", (data) => {
    formData += data;
  });
  req.on("end", () => {
    console.log("req reached");
    let query = qs.parse(formData);
    console.log(query);
    res.end(passengerController.create(query));
  });
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

app.use(driverRoutes);
