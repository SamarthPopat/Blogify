
import {validatetoken} from '../servises/uthentication.js'

//This is the genric middleware which is going to check for all of the request and responce:
function checkforauthenticationcookie(cookiename){
    return (req,res,next) => {
        const tokencookievalue = req.cookies[cookiename]
        if(!tokencookievalue)   return next()
        try{
            const userpayload= validatetoken(tokencookievalue)
            req.user=userpayload
        }catch(err){}
        next()
    }
}

export default checkforauthenticationcookie