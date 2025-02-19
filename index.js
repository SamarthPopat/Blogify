import express from 'express' 
import path from 'path' 
import useroute from './routes/user.js' 
import connection from './connection.js' 
const app=express();
const port=8000

//Connection the mongoose
connection("mongodb://localhost:27017/bloguser")
.then(()=>{
    console.log("Mongo has been connected successfully")
})
.catch((err)=>{
    console.log(`There is some error occured in order to connect the mongo and the err is ${err}`);
})

//Dev dependencys are those dependency which are only important on the devlopment environment:
//And there is no need to start the server agian and agian after the dploynment:
//So these nodemon is packge is not going any weher after the aployment and we can reduse the size of the code:
//And we are going to use the start script when we are on the production world:


//And here we are handling with the form data:---.so please first uncode it:
app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.set('view engine' , 'ejs')
app.set('views' , path.resolve("./view"))

app.get('/' , (req,res)=>{
    return res.render('home')
})

app.use('/user' , useroute)

app.listen(port , (err) =>{
    console.log(`The server has been started on the port number ${port}`);
}) 
//In the real world the thisng are not going and selecting like this:
//We have to find that weather this selected port is available or not at the cloud computing side