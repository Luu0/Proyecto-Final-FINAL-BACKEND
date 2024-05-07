import {getProductsFromMock} from "../Controllers/mockfetchController.js"
import { Router } from "express"
import { addLogger } from "../utils/logger.js";

const router = Router();

const loggerTextController = (req, res) => {
  res.send("Log generado correctamente");
};

router.get("/mockfetch",getProductsFromMock);
router.get("/logger",addLogger,loggerTextController)

export default router
