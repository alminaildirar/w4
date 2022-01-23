import {check, validationResult} from 'express-validator';


export const loginValidation = [
    check("userName", "Username is required.").notEmpty(),
    check("password", "Password is required.").notEmpty()
]

export const  checkErrorsForLogin = (req, res, next) => {

    const errors: Array<String> = validationResult(req).array().map(error => error.msg)
    errors.length > 0 ? res.render('login', {errors}) : next()

}




