const Crypto = require('crypto');


const hash = Crypto.createHash('sha256');
hash.update("personal_info")
var superman = hash.digest('hex');
console.log(superman);
