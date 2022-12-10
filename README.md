## Content

1. Sequelize
1. Defining models in cases of multiple tables
1. Controller
1. Routing to controllers via express app
1. Routing to controllers via express-router

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

(User is a class, we can call the sql queries on this class)
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

Note: In sequelize the queries returns a promise
To execute these queries we need to use the Class which we defined.

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

## More streamlined process

`sync.js`

Till now we wrote the define and the sql queries in a single file.

Note: In big projects we'll have multiple models/tables eg: in cab we have passenger table, driver table etc. Each of these tables are created using the define cmd. so following the above approch, to execute all these models we need to call the sync fn in each of the files. So to avoid it:

1. Either we can create a separate file for each model and export the model (export default Passenger; export default Driver;), and import it to a file called `sync.js`. This way we only need to call the sync.js file cmd to execute all these define cmds.

```
import passenger from "./passenger.js";

passenger.sync({alter: true});

`npm run sync` | "sync": "./models/sync.js".
```

2. Or we can put all the model in a same file called `models.js` [just the model not queries] and export the models( export {Passenger, Driver} [default export wont work]) to the `sync.js`.

`controller`

This would mean we need to move the sql queries to a different folder>file. (aka here we are making queries execute when we call a fn.). Since to execute the queries we need to use the class name that we defined while creating the table, so we import the `models.js` file to each controller

We create a controller for each model:

- passengerController for passenger model contains all the queries (CRUD) required for the passenger.
- driverController for driver model contains all the queries (CRUD) required for the driver.

In `model.js` define the `Passenger` and `Driver` tables. [link](https://github.com/emmanuelkiranr/sequelize/blob/main/models/models.js).

In the first approach to execute the query we just called the sync cmd, since now the queries are in a different file and wrapped inside a function, we need to call the function[routed from `index.js`] in addition to the sync cmd.

We create the fns that executes the sql query

`passengerController.js`

```
import { Passenger } from "../models/models.js";

const create = () => {
  Passenger.create({
    name: "Jack",
    email: "jack@gmail.com",
    password: "pass@123",
  })
    .then((pass) => {
      console.log("Data saved successfully", pass.toJSON());
    })
    .catch((err) => {
      console.log("err");
    });
};

export default create;
```

[code](https://github.com/emmanuelkiranr/sequelize/blob/main/controller/passengerController.js)

To call this function and execute the create query. we import these functions in the `index.js`

```
import passengerController from "./controller/passengerController.js";

app.get("/passenger/create", (req, res) => {
  res.end(passengerController.create);
});

app.get("/passenger/get", (req, res) => {
  res.end(passengerController.getAll);
});

app.post("/passenger/search", (req, res) => {
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
```

Note: use postman

- since for search query we need the id from the request, we can only get it via an form input, provided the form method is post or via postman. If we put get method and send req from browser it wont work, since get method doesnt put query while sending response, and it returns undefined

- The request urls are created in such a way that it clearly conveys who is executing that query [This convention is useful while doing authentication via middleware etc]

- We get the output to these routes/queries in the terminal.

[similarly create the controller and routing for driver]

## Taking input from user via form/postman

`passengerController.js`

```
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
```

`index.js`

```
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
```

## Express Router

Since right now we are routing to all the controllers>models[[both passengers & driver]] via the index.js, this could result in ending up as a huge file with so many routes in big projects.

So we setup routes for each controller.
Create a folder named routes, inside it create a routes file for each controller ie.

- driverRoutes- for routing to the functions in driverController
- passengerRoutes- for routing to the functions in passengerRoutes

Then in the index file we use a middleware to point the incomming requests to these routes. which then points them to the controller, which executes the query by connecting to db(models) and renders the output view as response(views).

## driverRouter

- converting the routing for driver controller from index.js to driverRouter

Firstly we start by coding the controller[already done], then we move to the router, [router > driverRoutes.js]. Then we create the hbs view for this which we defined in the controller as res.render(). Then in index.js we tell express to use the driverRoutes.js using a middleware.

`driverRouter.js`

The first route is for `create` fn/query

```
router.post("/driver/create", driverController.create);
```

Initially the `index.js` route was like:

```
app.post("/driver/create", (req, res) => {
  let formData = "";
  req.on("data", (data) => {
    formData += data;
  });
  req.on("end", () => {
    console.log("req reached");
    let query = qs.parse(formData);
    console.log(query);
    res.end(driverController.create(query));
  });
});
```

Because we wanted to get the queries as an object[to pass it to the controller] from the url we did this.

Since the new route is not taking an argument from querystring, we need to update the create fn in the driverController to get the queries directly from the request body.

`driverController.js`

```
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
};
```

Now when the express router routes the req to this fn we can get the query from the req.body [cause here the request itself is routed, earlier the request is handled and the output[query] is passed as parameter].

[NOTE: initially req.body returns undefined since its value is not in object format so we use a npm pkg called `body-parser` which converts the incoming req url into objects. The `{extended: true}` means we need to include the query string as well.]

The above router is similar to writing:

```
router.post("/driver/create", (req, res, next) => {
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
};);
```

We don't do this cause we wanted a more streamlined process via using controllers. And router is just used for routing the requests to the appropriate controller.

From now on the postman requests would show an error cause we aren't sending any response. Earlier we execute the queries directly from index.js through the res.end().

To avoid this and to send the response to the browser we use handlebars which sends output using res.render().
