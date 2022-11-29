import { Sequelize, DataTypes } from "sequelize";
// { } to import only what we need from the sequelize lib, or else it imports all fns

const sequelize = new Sequelize("person", "root", "My$ql@wb", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successfull");
  })
  .catch(() => {
    console.log("Connection failed");
  });

export default sequelize;
