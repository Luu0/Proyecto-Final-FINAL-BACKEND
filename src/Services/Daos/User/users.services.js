import UserModel from "../../../models/user.js";

export async function getAll (){
  return await UserModel.find()
}

export async function FindById (_id){
  return await UserModel.findById(_id)
}

export async function UpdateUser(pid){
  return await UserModel.findByIdAndUpdate(pid)
} 