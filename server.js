import 'dotenv/config'
import express from 'express' 
import path from 'path' 
import useroute from './routes/user.js' 
import blogroute from './routes/blog.js' 
import connection from './connection.js' 
import cookiesparser from 'cookie-parser'
import checkforauthenticationcookie from './middlewares/authentication.js'
import blog from './models/blog.js'
const app=express();
const port=process.env.PORT || 8080

console.log("Checking the mongour--->",process.env.MONGO_URL);
connection(process.env.MONGO_URL)
.then(()=>{
    console.log("Mongo has been connected successfully")
})
.catch((err)=>{
    console.log(`There is some error occured in order to connect the mongo and the err is ${err}`);
})



app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookiesparser())
app.use(checkforauthenticationcookie('token'))
app.use(express.static(path.resolve('./public')))


app.set('view engine' , 'ejs')
app.set('views' , path.resolve("./view"))

app.get('/' , async (req,res)=>{
    const allblogs=await blog.find({})
    return res.render('home' , {
        user: req.user,
        blogs:  allblogs,
    })
})

app.use('/user' , useroute)
app.use('/blog' , blogroute)

app.listen(port , (err) =>{
    console.log(`The server has been started on the port number ${port}`);
}) 
