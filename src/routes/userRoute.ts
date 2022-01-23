const router = require('express').Router()
import {createUser, loginUser,getDashboardPage, logoutUser} from "../controllers/userController"
import {checkErrorsForRegister, registrationValidation} from "../middlewares/registerValidator"
import {loginValidation, checkErrorsForLogin} from '../middlewares/loginValidator'
import { hasAuth } from "../middlewares/auth"

//http://localhost:3000/users/

router.route('/logout').get(logoutUser)
router.route('/register').post(registrationValidation, checkErrorsForRegister, createUser)
router.route('/login').post(loginValidation, checkErrorsForLogin, loginUser)
router.route('/dashboard').get(hasAuth, getDashboardPage)

const userRouter = router;
export default userRouter;