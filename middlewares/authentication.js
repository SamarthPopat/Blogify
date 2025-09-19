
import {validatetoken} from '../servises/uthentication.js'
import user from '../models/user.js'

function checkforauthenticationcookie(cookiename){
    return async (req,res,next) => {
        const tokencookievalue = req.cookies[cookiename]
        if(!tokencookievalue)   return next()
        try{
            const userpayload= validatetoken(tokencookievalue)
            const emailofcurrentuser=userpayload.email
            const currentuse = await user.findOne({
                email : `${emailofcurrentuser}`
            })
            req.user=currentuse
        }catch(err){}
        next()
    }
}

export default checkforauthenticationcookie