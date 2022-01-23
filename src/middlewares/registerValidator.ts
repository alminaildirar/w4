//This middleware is used to check before create user
import { RequestHandler } from 'express';
import {check, validationResult} from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';



export const checkErrorsForRegister:RequestHandler = async(req, res, next) => {

    const errors: Array<String> = validationResult(req).array().map(error => error.msg)

    if(await getRepository(User).findOne({userName: req.body.userName})){
        errors.push('Username already exist')   
    }
   
    errors.length > 0 ? res.render('register', {errors}) : next()
}


export const registrationValidation = [
    check("firstName", "First name is required.").notEmpty(),
    check("lastName", "Last name is required.").notEmpty(),
    check("userName", "Username is required.").notEmpty().isLength({min:3}).withMessage("Username must be at least 3 characters long."),
    check("password", "Password is required.").notEmpty().isLength({min:3}).withMessage("Password must be at least 3 characters long."),
    check("password2").custom((value, {req}) => {
        if(value != req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    })

]



