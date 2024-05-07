import { findProducts,createProduct,updateProduct,deleteProduct,getProductById } from "../Services/Daos/product/product.services.js";

export const FindProductsController = async (req, res) => {
  try {
      const { limit, page, query, sort } = req.query;
      const products = await findProducts(limit, page, query, sort);
      res.json({
          data: products,
          message: "Product list"
      })
  }
  catch (error) {
      console.log(error);
      res.json({
          error,
          message: "error"
      });
  }
};

export const FindProductsByIDController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const CreateProductController = async (req, res) => {
  try {
    if(req.session.user.rol==="admin" || req.session.user.rol==="premium"){
      const userEmail = req.session.user.email;
      const post = await createProduct({...req.body,owner:userEmail});
      res.json({
        post,
        message: "Product created",
      });
    }
    else{
      res.status(401).json({message:"Acceso denegado"})
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const UpdateProductController = async (req,res)=>{
  try {

    if(req.session.user.rol==="admin"){
      const { id } = req.params;
  
      const product = await updateProduct(id, req.body);
  
      res.json({
        product,
        message: "Product updated",
      });
    }
    else{
      res.status(401).json({message:"Acceso denegado"})
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const DeleteProductController = async (req,res)=>{
  try {
    if(req.session.user.rol==="admin"){
      const { id } = req.params;
      const cart = await deleteProduct(id);
  
      res.json({
        cart,
        message: "Product deleted",
      });
    }
    else{
      res.status(401).json({message:"Acceso denegado"})
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
};



