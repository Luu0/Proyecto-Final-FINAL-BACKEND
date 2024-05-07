import { Router } from "express";
import { getcartContrller,createCartController,getCartByIdController,UpdateCartController,addProductToCartController,DeleteCartController,DeleteCartProductController,finishPurchaseController,createEmptyController } from "../Controllers/cart.controllers.js";
const router = Router();

router.get("/", getcartContrller);

router.post("/", createCartController);

router.post("/empty",createEmptyController)

router.get("/:cid", getCartByIdController);

router.put('/:cid', UpdateCartController);

router.post('/:cid/product/:pid', addProductToCartController);

router.delete('/:cid', DeleteCartController)

router.delete("/:cid/product/:pid", DeleteCartProductController);

router.get("/:cid/purchase",finishPurchaseController);

export default router;

