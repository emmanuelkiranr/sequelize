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

export default User;
