import { RequestHandler } from "express";

export const alreadyLogin: RequestHandler = (req, res, next) => {
  try {
    if (req.session.userID) {
      return res.redirect("/");
    }
    next();
  } catch (Error) {
    throw new Error();
  }
};
