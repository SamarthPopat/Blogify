import { Router } from 'express'
import multer from 'multer'
import path from 'path'
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

router.post('/', upload.single('coverimage') ,(req,res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect('/')
})

export default router