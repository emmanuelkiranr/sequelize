# Sequelize

Firstly we instantiate sequelize with name of database, username and password (similar to the db_handler in [node-database](https://github.com/emmanuelkiranr/node-database/blob/main/models/db_handler.js)

```
import { Sequelize, DataType } from "sequelize";

const sequelize = new Sequelize("person", "root", "My$ql@wb", {
  host: "localhost",
  dialect: "mysql",
});
```

Then we test the connection (sequelize uses mysql2 under the hood)

```
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successfull");
  })
  .catch(() => {
    console.log("Connection failed");
  });
```

Once connection is established we can start executing queries by defining them in `user.js`. (similar to person.js in [node-database](https://github.com/emmanuelkiranr/node-database/blob/main/models/person.js))

`user.js`

```
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

<!-- export default User; -->
User.sync({alter: true});

```

This will create a new table named "User" in the person db with these columns with their defined properties.
To execute this query, we use the sync() cmd.

```
user.sync();
```

This will create a new table if it doesn't already exist, but in cases where the table exist and we want to add another column etc. This wont work as it does nothing if the table already exist.

To overcome this use force

```
user.sync({ force: true });
```

This would delete the existing table and create a new one everytime, this will result in data loss

To overcome this use alter

```
user.sync({ alter: true });
```

This checks the current state of the table in db and if there is any change, it will only update that change and not the entire table

To execute, we create a new script in package.json, ie sync `npm run sync` | "sync": "./models/sync.js",

## Execute sql queries

`user.js`

Adding a new entry into the table

```
User.create({ name: "Jack", email: "jack@mail", age: 22 })
  .then((data) => {
    console.log("Data saved successfully", data.toJSON());
  })
  .catch((err) => {
    console.log("err");
  });
```

(Even if there is an error the id is incremented)

get details of all users from the table

```
User.findAll()
  .then((user) => {
    console.log(user);
  })
  .catch((err) => {
    console.log(err);
  });
```

get details of a users from the table with the id

```
User.findAll({
  where: {
    id: 2,
  },
})
  .then((users) => { - users is an array of user with id 2, and we use dataValues property to access the values
    users.forEach((user) => {
      console.log(user.dataValues.id, user.dataValues.name);
    });
  })
  .catch((err) => {
    console.log(err);
  });
```

Or since id is the pk we can use

```
User.findByPk(1).then((users) => {
  console.log(user.dataValues.id, user.dataValues.name);
});
```

To execute, we create a new script in package.json, ie sync `npm run sync` | "sync": "./models/user.js".
