import { generateProduct } from "../utils/mockfetch.js";

export const getProductsFromMock = async(req,res)=>{
  try {
    let productsMock = [];
    for (let i = 0; i < 100; i++) {
      productsMock.push(generateProduct());
    }
    res.send({ status: "success", payload: productsMock });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, message: "No se pudo obtener los Productos:" });
  }
}