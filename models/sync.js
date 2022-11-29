import user from "./user.js";

// user.sync();
// This will create a new table if it doesn't already exist, but in cases where the table exist and we want to add another column etc,
// this wont work as it does nothing if the table already exist.

// To overcome this use force
// user.sync({ force: true });
// This would delete the existing table and create a new one everytime, this will result in data loss

// To overcome this use alter
user.sync({ alter: true });
// This checks the current state of the table in db and if there is any change, it will only update that change and not the entire table
