import { Driver } from "../models/models.js";

// const create = () => {
//   Driver.create({
//     name: "joe",
//     email: "joe@gmail.com",
//     password: "pass@456",
//   })
//     .then((pass) => {
//       console.log("Data saved successfully", pass.toJSON());
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const create = (driver) => {
  Driver.create({
    name: driver.name,
    email: driver.email,
    password: driver.password,
  })
    .then((drive) => {
      console.log("Data saved successfully", drive.toJSON());
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAll = () => {
  Driver.findAll().then((Drivers) => {
    console.log(Drivers);
  });
};

const search = (id) => {
  Driver.findByPk(id).then((Driver) => {
    console.log(
      Driver.dataValues.id,
      Driver.dataValues.name,
      Driver.dataValues.email
    );
    console.log(id);
  });
};

export default { create, getAll, search };
