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
        // require: true,
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

//In order to use the sault to hash the password we have to do some pre computation:
userschema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()
    // if (!user.isModified('password')) return next()
    //And now in order to do the hasshing we have to use the builtin package called cripto

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
    // const sault='somerandosault'
    const sault=user.sault
    const hashedpassword=user.password

    const userprovidedhash=createHmac('sha256', sault)
                            .update(password)
                            . digest('hex')
    // if(hashedpassword === userprovidedhash) return {...user._documet , password:undefined , sault:undefined}
    // if(hashedpassword === userprovidedhash) return user -->Insted of this we are going to return a token:
    if(hashedpassword !== userprovidedhash) throw new Error('Wrong password:)') 
    const token=createtokenforuser(user)
    return token
    
})

const user = model('user', userschema)

export default user