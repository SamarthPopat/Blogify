import { Router } from 'express'
import user from '../models/user.js'
const router = Router()

router.get('/signin', (req, res) => {
    return res.render('signin')
})
router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body
        // const nuser = await user.matchpassword(email, password)
        const token = await user.matchpasswordandgeneratetoken(email, password)
        // console.log(token);.
        return res.cookie('token' , token).redirect('/')
    }catch (err){
        return res.render('signin' , {
            error:  err,
        })
    }
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
        return res.status(200).redirect('/');
    } catch (error) {
        // console.error("Error creating user:", error);
        // return res.status(500).json({ status: "Error occurred while signing up" });
        return res.render('signup' , {
            error : err,
        })
    }
});

router.get('/logout' ,(req,res) => {
    res.clearCookie('token').redirect('signin')
})

export default router