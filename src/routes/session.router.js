import { Router } from "express";
import UserModel from "../models/user.js";
import { createHash, isValidPassword } from "../dirname.js";
import {sendPasswordToResetEmail} from "../utils/nodeMailer.js"
import generateUniqueToken from "../utils/crypto.js";
import passport from "passport";


const router = Router()

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), 
async (req, res) => {
  { }
})

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), 
async (req, res) => {
  const user = req.user;
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age
  };
  req.session.admin = true;
  res.redirect("/users");
})

router.post('/register', passport.authenticate("register", {
  failureRedirect: "api/session/fail-register"
}), async (req,res)=>{

res.send({status:"success", msg:"User created"})
})


router.post('/login', passport.authenticate("login", {
  failureRedirect: "api/session/fail-login"
}), async (req,res) => {
  let rol;
  if(req.body.email == "adminCoder@coder.com" && req.body.password == "adminCod3r123"){
    rol = "admin";
  }
  const user = req.user;

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    rol: user.rol,
    cart_id: user.cart_id
  }

  user.last_conection = new Date().toLocaleString();
  await user.save();

  res.send({status:'success', payload: req.session.user, message:'Log successful'})
})

router.get('/logout', async (req,res)=>{
  try {
    const userEmail = req.session.user.email;
    const user = await UserModel.findOne({ email: userEmail });

    user.last_conection = new Date().toLocaleString();
    await user.save();
    req.session.destroy(err =>{
      if(!err) return res.status(200).send("deslogueo exitoso")
      else res.send("fallo el deslogueo")
    });
  } catch (error) {
    console.error('Error at logout:', error);
    res.status(500).send('Internal server error');
  }
})


router.post('/reset-password/:token', async (req, res) => {
  const token = req.params.token
  const { password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).send('Las contraseñas no coinciden.')
  }

  try {
    const user = await UserModel.findOne({ resetToken: token })
    
    if (!user || Date.now() > user.resetTokenExpires) {
      return res.render('reset-password-expired')
    }
    user.password = createHash(password)
    user.resetToken = undefined
    user.resetTokenExpires = undefined
    await user.save()
    
      res.send('Password changed succesfuly.')
  } catch (error) {
    console.error('Error at changing password:', error)
    res.status(500).send('internal server error.')
  }
})


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    const resetToken = await generateUniqueToken();
    const resetTokenExpires = Date.now() + (60 * 60 * 1000);
    
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    
    await user.save();
    sendPasswordToResetEmail(user.email, resetToken);
    
    res.send('Email sent correctly');
  } catch (error) {
    console.error('Error recovering password:', error);
    res.status(500).send('Server internal error');
  }
});

export default router;