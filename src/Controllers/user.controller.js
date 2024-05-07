import { getAll,FindById,UpdateUser } from "../Services/Daos/User/users.services.js";
import UserModel from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAll();
    res.json({
        data: users,
        message: "Users list"
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


export const getUserByIdController = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await FindById(uid);

    if (!user) return res.json({ message: "User not found" });

    res.json({
      user,
      message: "User found",
    });
  } catch (error) {

    res.status(500).json({
      error: error.message,  
      message: "Error",
    });
  }
};


export const MakeUserPremium =  async (req, res)=>{
  try{
    const userId = req.params.uid;
    const user = await FindById(userId);

    if (!req.files || req.files.length !== 3) {
      return res.status(400).send({ status: "error", message: "You must attach exactly 3 files" });
    }

    const documents = req.files.map(file => ({
      name: file.filename,
      reference: file.path
    }));
    
    user.documents = [...user.documents, ...documents];

    if (!user) {
      return res.status(404).send("User not found");
    }
    user.rol= user.rol === 'user' ? 'premium' : 'user';
    await user.save();

    res.json({
      user,
      message: "User now is premium",
    });

  }catch (error) {
    console.error("Error at changing user roll:", error);
    res.status(500).send("Internal server error");
  }
}


export const UploadDocument = async(req,res)=>{
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));

    user.documents = [...user.documents, ...documents];
    await user.save();

    res.status(200).send('Documents uploaded successfully');
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).send('Internal server error');
  }
};