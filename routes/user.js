import {Router} from 'express'
import user from '../models/user.js'
const router=Router()

router.get('/signin' , (req,res)=>{
    return res.render('signin')
})
router.get('/signup' , (req,res)=>{
    return res.render('signup')
})

router.post('/signin' , (req,res)=>{
    const {email , prassword} = req.body
    
})

router.post('/signup', async (req, res) => {
    // console.log("hit the route");
    try {   
        const { fullname, email, password } = req.body;
        const newUser = await user.create({
            fullname,
            email,
            password
        });
        return res.redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ status: "Error occurred while signing up" });
    }
});    

export default router