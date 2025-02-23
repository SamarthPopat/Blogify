import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import blog from '../models/blog.js'
const router = Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null , filename)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req,res) => {
    return res.render('addblogs' , {
        user: req.user
    })
})

router.post('/', upload.single('coverimage') ,async (req,res) => {
    // console.log(req.body);
    // console.log(req.file);
    const {title , body} = req.body
    const Blog=await blog.create({
      title,
      body,
      createdby : req.user._id,
      coverimageurl : `/uploads/${req.file.filename}`
    })
    req.Blog=Blog
    console.log(Blog._id);
    return res.redirect(`/blog/${Blog._id}`)
    // return res.redirect("/")
})


//This is the route of the get which is dynamic route:
router.get('/:id' , async (req,res)=>{
  // if(req.cookie!='token') return res.render('signin')
  const Blog =  await blog.findById(req.params.id)
  return res.render('blogrender',{
    user : req.user,
    blog : Blog
  })
})
export default router