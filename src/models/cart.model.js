import mongoose from "mongoose";
import { Schema,model } from "mongoose";


const cartSchema = new mongoose.Schema({
  products:{
    type:[
      {
        product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'products'
        },
        quantity:{type:Number, default: 1}
      },
    ],
    _id:false
  }
});

const CartModel = model("carts", cartSchema);

export {CartModel};