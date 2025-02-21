import mongoose, {model} from 'mongoose'
const blogschema=new Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    coverimageurl:{
        type:String,
        require:false
    },
    createdby:{
        type:Schema.Types.ObjectId,//This is an built in type:
        ref: "user"//This will point to the user:
    },
},{timestamps:true})

const blog=model('blog' ,blogschema)

export default blog