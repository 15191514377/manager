const jwt = require('jsonwebtoken')
const secret = 'zhou'

const JWT = {
    // expiresIn过期时间
    generate:(value,expiresIn)=>{
        console.log('value',value);
        return jwt.sign(value,secret,{expiresIn})
    },
    verify:(token)=>{
        try{
            return jwt.verify(token,secret)
        }catch(e){
            return false
        }
    }
}

module.exports = JWT