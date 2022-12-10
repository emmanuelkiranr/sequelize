import { Driver } from "../models/models.js";

const create = (req, res, next) => {
  console.log(req.body);
  Driver.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
    .then((drive) => {
      console.log("Data saved successfully", drive.toJSON());
    })
    .catch((err) => {
      console.log(err);
    });
}; // - input via postman routed from express-router not the express app

const getAll = () => {
  Driver.findAll().then((Drivers) => {
    console.log(Drivers);
  });
};

const search = (req, res, next) => {
  Driver.findByPk(req.body.id).then((Driver) => {
    console.log(
      Driver.dataValues.id,
      Driver.dataValues.name,
      Driver.dataValues.email
    );
  });
};

export default { create, getAll, search };
