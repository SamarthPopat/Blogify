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
        const token = await user.matchpasswordandgeneratetoken(email, password)
        return res.cookie('token' , token).redirect('/')
    }catch (err){
        return res.render('signin' , {
            error:  err,
        })
    }
})

router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const newUser = await user.create({
            fullname,
            email,
            password
        });
        return res.status(200).redirect('/');
    } catch (error) {
        return res.render('signup' , {
            error : error,
        })
    }
});

router.get('/logout' ,(req,res) => {
    res.clearCookie('token').redirect('signin')
})

export default router