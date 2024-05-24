import {Router} from 'express'
import { authMiddlewareAdmin, authMiddlewareUser } from './Custom/authMiddleware.js';
import { getAllUsers,getUserByIdController,MakeUserPremium,UploadDocument,UpdateCartId} from '../Controllers/user.controller.js';
import { upload } from '../middlewares/multermiddleware.js';

const router = Router();

router.get("/allusers",getAllUsers)

router.get("/find/:uid",getUserByIdController)

router.get("/premium/:uid", authMiddlewareUser, upload.array("documents"), MakeUserPremium)

router.post('/:uid/documents',upload.array("document"),UploadDocument)

router.get("/login", (req,res)=>{
    res.render('login')
})

router.post("/users/updateCartId",UpdateCartId)

router.get('/userdata', (req, res) => {
    const user = req.session.user;
    res.json({ user });
});

router.get("/register", (req,res)=>{
    res.render('register')
})

router.get("/",authMiddlewareUser, (req,res)=>{
    res.render('profile', {user:req.session.user})
})

router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('reset-password', { token });
});

router.get('/recover-password', (req, res) => {
    res.render('recover-password');
})

export default router