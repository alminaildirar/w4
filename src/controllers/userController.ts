import { getRepository } from "typeorm";
import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { User } from "../entity/User";

//This function is used to create jwt token
const createToken = (userID: number, browserInfo: string): string =>
  jwt.sign({ userID, browserInfo }, 'secret', {
    expiresIn: 90000,
  });

//This interface is created for the information we will save the session.
declare module "express-session" {
  interface SessionData {
    browserInfo: String;
    userID: String;
  }
}

export const createUser: RequestHandler = async (req, res) => {
  try {

    const { firstName, lastName, userName, password } = req.body;
    const user = await getRepository(User).create({
      firstName,
      lastName,
      userName,
      password: await hash(password, 10),
    });
    await getRepository(User).save(user);
    res.status(201).redirect("/login");
  } catch (Error) {
    throw new Error();
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await getRepository(User).findOne({ userName });
    if (user && (await compare(password, user.password))) {
      //Create session
      req.session.browserInfo = req.headers["user-agent"];
      req.session.userID = user.id;

      //Create token
      const token = createToken(user.id, req.headers["user-agent"]);

      res.cookie("jwt", token, { httpOnly: true, maxAge: 90000 });

      res.status(200).redirect("/users/dashboard");
    }
  } catch (err) {
    throw err;
  }
};

export const logoutUser: RequestHandler = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) res.send(" :( ");
      else {
        res.clearCookie("connect.sid", { path: "/" });
        res.clearCookie("token");
        res.redirect("/");
      }
    });
  } catch (Error) {
    throw new Error();
  }
};

export const getDashboardPage: RequestHandler = async (req, res) => {
  try {
    const users = await getRepository(User).find({});
    res.status(200).render("dashboard", { users });
  } catch (Error) {
    throw new Error();
  }
};
