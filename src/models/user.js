import mongoose from "mongoose";

const collection = "users"

const schema = new mongoose.Schema({
  first_name:String,
  last_name:String,
  email:{
    type:String,
    unique:true
  },
  age:Number,
  password:String,
  rol:{
    type:String,
    default:"user",
    enum: ["user", "admin", "premium"]
  },
  documents: [
    {
      name: {
        type: String,
        required: true
      },
      reference: {
        type: String,
        required: true
      }
    }
  ],
  last_conection:String,
  resetToken: String,
  resetTokenExpires: Date,
  last_cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts' // Nombre de la colección del modelo de carrito
  }
  
})

const UserModel = mongoose.model(collection,schema);

export default UserModel;