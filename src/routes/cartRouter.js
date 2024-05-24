import { Router } from "express";
import { getCartDetailsController,getcartContrller,createCartController,getCartByIdController,UpdateCartController,addProductToCartController,DeleteCartController,DeleteCartProductController,finishPurchaseController,createEmptyController} from "../Controllers/cart.controllers.js";

const router = Router();

router.get("/", getcartContrller);

router.post("/", createCartController);

router.post("/empty",createEmptyController)

router.get("/:cid", getCartByIdController);

router.put('/:cid', UpdateCartController);

router.post('/:cid/product/:pid', addProductToCartController);

router.delete('/:cid', DeleteCartController)

router.delete("/:cid/product/:pid", DeleteCartProductController);

router.get("/:cid/purchase/finish",finishPurchaseController);

router.get("/purchase/cart", async (req, res) => {
  try {
    const userData = req.session.user;

    if (!userData || !userData.cart_id) {
      return res.status(400).json({ message: "El usuario no tiene un carrito asignado" });
    }

    const cart = await getCartDetailsController(userData.cart_id);

    res.render("cart", { cart, user: userData, cartId: userData.cart_id }, (err, html) => {
      if (err) {
        throw err;
      }
      res.send(html);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;

