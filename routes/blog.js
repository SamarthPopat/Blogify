import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import blog from '../models/blog.js'
import comment from '../models/comment.js'
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
    // console.log(Blog._id);
    return res.redirect(`/blog/${Blog._id}`)
    // return res.redirect("/")
})


//This is the route of the get which is dynamic route:
router.get('/:id' , async (req,res)=>{
  // if(req.cookie!='token') return res.render('signin')
  const Blog =  await blog.findById(req.params.id).populate('createdby')
  // console.log(Blog);//This is going to embaded the user hole object which is created this blog inside that:
 
  //Now we are going to add one of the new feature in which if the user is going to open this blog
  // They can also see the comments on it
  const allcomments=await comment.find({
    blogid: req.params.id
  }).populate('createdby')
 
  // console.log(allcomments);
  return res.render('blogrender',{
    user : req.user,
    blog : Blog,
    comment: allcomments
  })
})

router.post('/comment/:blogid' ,async (req,res)=>{
  // const ncomment = await comment.create({
  await comment.create({
    content: req.body.content,
    blogid: req.params.blogid,
    createdby: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogid}`)
})
export default router