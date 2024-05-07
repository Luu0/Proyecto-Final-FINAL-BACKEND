import { Router } from "express";
import { FindProductsByIDController, FindProductsController,CreateProductController, UpdateProductController, DeleteProductController, } from "../Controllers/product.controllers.js";

const router = Router();

router.get("/", FindProductsController );

router.get("/:id", FindProductsByIDController);

router.post("/", CreateProductController);

router.put("/:id", UpdateProductController);

router.delete("/:id", DeleteProductController);



export default router;