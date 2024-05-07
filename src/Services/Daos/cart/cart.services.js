import { CartModel } from "../../../models/cart.model.js";

export async function findCart(){
  return await CartModel.find();
}

export async function findById(id) {
  return await CartModel.findById(id);
}

export async function createCart  (products) {
  return await CartModel.create({
    products,
  });
};

export async function updateProducts(cid,cart){
  return await CartModel.findByIdAndUpdate(cid, cart)
}

export async function deleteProductFromCart(cid, pid) {
  try {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const initialProductCount = cart.products.length;

    cart.products = cart.products.filter(p => !p._id.equals(pid));

    if (cart.products.length === initialProductCount) {
      throw new Error('Producto no encontrado en el carrito');
    }

    await cart.save();

    return cart;
  } catch (error) {
    throw error;
  }
}