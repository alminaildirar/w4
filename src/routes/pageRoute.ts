import { getIndexPage, getRegisterPage, getLoginPage} from "../controllers/pageController"
import { alreadyLogin } from "../middlewares/checkAlreadyLogin"
const router = require('express').Router()



router.route('/').get(getIndexPage)
router.route('/register').get(getRegisterPage)
router.route('/login').get(alreadyLogin, getLoginPage)


const pageRouter = router;
export default pageRouter;