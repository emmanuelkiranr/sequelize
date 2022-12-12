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

const getAll = (req, res, next) => {
  Driver.findAll().then((getData) => {
    res.render("getData", { data: getData });
    // look at the format of the return viewing the data in the hbs view by {{data}} or {{data.data}}
    // console.log(getData);
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
