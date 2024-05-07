import { postModel } from "../../../models/product.model.js";

export async function findProducts(limit = 10, page = 1, query, sort) {
  let consult = {}

  if (query != undefined){
    consult[query.split(":")[0]] = query.split(":")[1]
  }
  return await postModel.paginate(consult,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
}

export async function createProduct(post) {
  return await postModel.create(post);
}

export async function updateProduct(_id, post) {
  return await postModel.findOneAndUpdate({ _id }, post);
}

export async function deleteProduct(_id) {
  return await postModel.findByIdAndDelete({ _id });
}

export async function getProductById(_id){
  return await postModel.findById(_id)
}