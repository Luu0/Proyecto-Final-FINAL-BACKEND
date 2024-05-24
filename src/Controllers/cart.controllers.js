import { findCart, findById, createCart, updateProducts, deleteProductFromCart } from "../Services/Daos/cart/cart.services.js";
import { findProducts,createProduct,updateProduct,deleteProduct,getProductById } from "../Services/Daos/product/product.services.js";
import {createTicket} from "../Services/Daos/ticket/ticket.dao.js"
import { CartModel } from "../models/cart.model.js";
import TicketDto from "../Services/dto/ticket.dto.js"
import sendMail  from "../utils/nodeMailer.js";
import mongoose from "mongoose";

export const getcartContrller = async (req, res) => {
  try{
    const Carts = await findCart();
    res.json({
      data: Carts,
      message: "Cart List"
    });
  }catch(error){
    res.json({
      error,
      message: "Error",
    });
  }
};


export const createEmptyController = async (req, res) => {
  const { products } = req.body;
  
  try {
    if (!req.user.cart_id) {
      const productMap = products.map(({ productId, quantity }) => ({
        product: productId,
        quantity: quantity || 1,
      }));
      
      const newCart = await createCart(productMap);
      
      req.user.cart_id = newCart._id;
      await req.user.save();
      
      res.status(200).json({ message: "Successfully created!", cartCreated: newCart });
    } else {
      res.status(200).json({ message: "User already has a cart assigned!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const createCartController = async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      error: "Please send a non-empty array of products to create your cart.",
    });
  }

  try {
    const productMap = products.map(({ productId, quantity }) => ({
      product: productId,
      quantity: quantity || 1,
    }));

    const newCart = await createCart(productMap);

    res.status(200).json({ message: "Successfully created!", cartCreated: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartByIdController = async (cartId) => {
  try {
    const cart = await findById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // await cart.populate('products.product').execPopulate();

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el carrito");
  }
};

export const getCartDetailsController = async (cartId) => {
  try {
    const cart = await CartModel.findById(cartId).populate('products.product').exec();

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el carrito con detalles");
  }
};

export const UpdateCartController = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: "Invalid quantity format" });
    }

    let cart = await findById(req.params.cid);

    cart.products.forEach((product) => {
      product.quantity += quantity;
    });

    const updatedCart = await updateProducts(cart._id, cart);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await getProductById(pid);
    const cart = await findById(cid);

    if (!product || !cart) {
      return res.status(404).json({ error: "Producto o carrito inexistente" });
    }

    const existingProductIndex = cart.products.findIndex(e => e.product._id.toString() === product._id.toString());

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    const updatedCart = await updateProducts(cid, cart);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const DeleteCartController = async (req,res)=>{
  try{
      let deleted = await findById(req.params.cid)
      deleted.products = []
      let updatedCart = updateProducts(req.params.cid,deleted)
      res.status(201).json(deleted.message)
  }
  catch(err){ res.status(500).json({error:err})}
  
};

export const DeleteCartProductController = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await deleteProductFromCart(cid, pid);
    res.json({
      result,
      message: "Product deleted"
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const finishPurchaseController = async (req,res) =>{
  try {
    let cart = await findById(req.params.cid);
    let total_price = 0;
    let unstocked_products = [];
    
    for (const item of cart.products) {
      let product = await getProductById(item.product);      
      if (product) {
        if (product.stock >= item.quantity) {
          total_price += item.quantity * product.price;

          console.log(total_price)

          let stockLowering = await updateProduct(item.product, { stock: product.stock - item.quantity });
        } else {
          unstocked_products.push({ product: product._id, quantity: item.quantity });
          console.log(item.quantity)
        }
      } else {
        console.log(`Product not found for ID: ${item.product}`);
      }
    }

    if(total_price > 0){
      cart.products = unstocked_products
      let newCart = await updateProducts(req.params.cid,cart)
      let newTicket = await createTicket({code:`${req.params.cid}_${Date.now()}`,amount:total_price,purchaser:req.session.user.email})
      
      await sendMail(req.session.user.email, newTicket )
      return res.status(200).json(new TicketDto(newTicket))
    } 
    else{
      return res.status(404).json({message:"No se realizó ninguna compra"})
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}