import { Router } from "express";
import { cambiarPasswordHandler, loginHandler, loginHandlerGoogle, recoverPasswordHandler } from '../handlers/loginHandler.js'

const loginRouter = Router();

loginRouter.get("/", loginHandler);
loginRouter.get("/google", loginHandlerGoogle);
loginRouter.get("/password", recoverPasswordHandler);
loginRouter.post("/password", cambiarPasswordHandler);

export default loginRouter