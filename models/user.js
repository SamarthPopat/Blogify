import mongoose, { model } from 'mongoose'
import { createHmac, randomBytes } from 'node:crypto'
import {createtokenforuser , validatetoken} from '../servises/uthentication.js'

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sault: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileimageurl: {
        type: String,
        default: '/images/defult.jpg'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true })

userschema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()
    const sault =randomBytes(16).toString()
    const hashedpassword = createHmac('sha256', sault)
                            .update(user.password)
                            .digest('hex')
    this.sault=sault
    this.password=hashedpassword 
    next()
})

userschema.static("matchpasswordandgeneratetoken" , async function(email , password){
    const user=await this.findOne({email})
    if(!user)  throw new Error('This mail id is not registered yet')
    const sault=user.sault
    const hashedpassword=user.password

    const userprovidedhash=createHmac('sha256', sault)
                            .update(password)
                            .digest('hex')
    if(hashedpassword !== userprovidedhash) throw new Error('Wrong password:)') 
    const token=createtokenforuser(user)
    return token
    
})

const user = model('user', userschema)

export default user