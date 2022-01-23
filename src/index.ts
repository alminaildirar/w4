require("dotenv").config();
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { TypeormStore } from "typeorm-store";
import userRoute from "./routes/userRoute";
import pageRoute from "./routes/pageRoute";
import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Session } from "./entity/Session";

createConnection().then(() => {

  //---------Init Express App--------
  const app = express();
  app.set("view engine", "ejs");

  //---------Middlewares--------------
  app.use(express.static("public"));
  // for parsing application/json
  app.use(express.json());
  // for parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

 //----Create repo for sessions------------
  const repository = getConnection().getRepository(Session);

  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 90000,
      },
      store: new TypeormStore({ repository }),
    })
  );

  //------------Routes-----------
  app.use("/", pageRoute);
  app.use("/users", userRoute);

  //--------Error Handling--------
  app.use((Error, res) => {
    res.status(500).render("500", {Error});
  });

  app.listen(3000, () => {
    console.log(`Server is running on 3000.`);
  });
});
