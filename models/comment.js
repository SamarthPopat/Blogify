import mongoose, {model, Schema, Types} from 'mongoose'
const commentschema = new mongoose.Schema({
    content:{
        type: String,
        required : true 
    },
    blogid:{
        type: Schema.Types.ObjectId,
        ref: "blog"
    },
    createdby:{
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},{timestamps:true})

const comment = model('comment', commentschema)

export default comment