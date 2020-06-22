const sha256 = require('js-sha256')
const AccessControl = function(API_KEY, SECRET_KEY, UNIX, API_TOKEN){
    const hash = sha256.create()
    hash.update(API_KEY+''+SECRET_KEY+''+UNIX)
    const encode = hash.hex()
    if((Math.floor(new Date()) / 1000) - UNIX <= 10){
        if(API_TOKEN == encode){
            return true
        }else{
            return 0
        }
    }else{
        return false
    }
}
exports.AccessControl = AccessControl