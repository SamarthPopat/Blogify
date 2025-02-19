import mongoose, { model } from 'mongoose'
import { createHmac, randomBytes } from 'node:crypto'

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    sault: {
        type: String,
        // require: true,
    },
    password: {
        type: String,
        require: true,
    },
    profileimageurl: {
        type: String,
        default: '/images/default.jpeg'
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
    if (!user.isModified(this.password)) return next()
    // if (!user.isModified('password')) return next()
    //And now in order to do the hasshing we have to use the builtin package called cripto

    const sault = randomBytes(16).toString()
    const hashedpassword = createHmac('sha256', sault)
                            .update(user.password)
                            .digest('hex')
    this.sault=sault
    this.password=hashedpassword 
    next()
})

userschema.static("matchpassword" , function(email , password){
    const user=this.findOne({email})
    if(!user) return false
    
    const sault=user.sault
    const hashedpassword=user.password

    const userprovidedhash=createHmac('sha256', sault)
                            .update(password)
                            . digest('hex')
    return hashedpassword === userprovidedhash
})

const user = model('user', userschema)

export default user