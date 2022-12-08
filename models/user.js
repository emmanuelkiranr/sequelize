import { DataTypes } from "sequelize";
import sequelize from "./db_handler.js";
// similar to importing executequery fn from db_handler in node_db

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    defaultValue: 18,
    allowNull: false,
  },
});

// adding a new entry into the table
User.create({ name: "Jack", email: "jack@mail", age: 22 })
  // User.create({ name: "Jill", email: "jill@mail" })
  .then((user) => {
    console.log("Data saved successfully", user.toJSON());
  })
  .catch((err) => {
    console.log("error");
  });

// get details of all users from the table
User.findAll()
  .then((user) => {
    console.log(user);
  })
  .catch((err) => {
    console.log(err);
  });

// get details of a users from the table with the id
User.findAll({
  where: {
    id: 2,
  },
})
  .then((users) => {
    console.log(users);
    users.forEach((user) => {
      console.log(user.dataValues.id, user.dataValues.name);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// or since id is the pk we can use
User.findByPk(1).then((user) => {
  console.log(user.dataValues.id, user.dataValues.name);
});

export default User;
