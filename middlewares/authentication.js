
import {validatetoken} from '../servises/uthentication.js'
import user from '../models/user.js'

//This is the genric middleware which is going to check for all of the request and responce:
function checkforauthenticationcookie(cookiename){
    return async (req,res,next) => {
        const tokencookievalue = req.cookies[cookiename]
        if(!tokencookievalue)   return next()
        try{
            const userpayload= validatetoken(tokencookievalue)
            const emailofcurrentuser=userpayload.email
            // console.log("This is the payload of the user"+userpayload.email);
            const currentuse = await user.findOne({
                email : `${emailofcurrentuser}`
            })
            req.user=currentuse
            // console.log("Can we got the final result?" + currentuse);
        }catch(err){}
        next()
    }
}

export default checkforauthenticationcookie