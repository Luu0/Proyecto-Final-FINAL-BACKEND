import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { Schema,model } from "mongoose";

const postSchema = new Schema({
  title: {type:String, required:true},
  descripcion: {type:String, required:true},
  price: {type:Number, required:true},
  thumbnail: {type:String, required:false},
  code: {type:String, required:true},
  stock: {type:Number, required:true},
  owner:{type:String, required:false},
})

postSchema.plugin(mongoosePaginate);

const postModel = model("products", postSchema);

export{postModel};