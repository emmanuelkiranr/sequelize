import { Passenger } from "../models/models.js";
// import { DataTypes } from "sequelize";

// const create = () => {
//   Passenger.create({
//     name: "Jack",
//     email: "jack@gmail.com",
//     password: "pass@123",
//   })
//     .then((pass) => {
//       console.log("Data saved successfully", pass.toJSON());
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const create = (passenger) => {
  Passenger.create({
    name: passenger.name,
    email: passenger.email,
    password: passenger.password,
  })
    .then((pass) => {
      console.log("Data saved successfully", pass.toJSON());
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAll = () => {
  Passenger.findAll().then((passengers) => {
    console.log(passengers);
  });
};

const search = (id) => {
  Passenger.findByPk(id).then((passenger) => {
    console.log(
      passenger.dataValues.id,
      passenger.dataValues.name,
      passenger.dataValues.email
    );
    console.log(id);
  });
};

export default { create, getAll, search };
