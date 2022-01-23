import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export const hasAuth: RequestHandler = async (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    if (!token) return res.render("login", { errors });

    jwt.verify(token, 'secret', (err, decoded) => {
      if (decoded.userID && decoded.browserInfo) {
        if (
          req.session.userID === decoded.userID &&
          decoded.browserInfo === req.session.browserInfo
          
        ) {
          console.log('---------Request Session Info-----------')
          console.log(req.session)
          console.log('')
          console.log('------------JWT Token Info---------------')
          console.log(decoded)
          next();
        } else {
          res.render("login", { errors });
        }
      } else {
        res.render("login", { errors });
      }
    });
  } catch (error) {
    throw new Error;
  }
};

const errors: Array<String> = [];
