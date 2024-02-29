#!/usr/bin/node
const CryptoJS = require('crypto-js');
const crypto = require('crypto');

// Secret key generator function
function key_generator(){
    return crypto.randomBytes(32).toString('hex');
}

// Encrypt function
function encrypt(text, key){
    return CryptoJS.AES.encrypt(text, key).toString();
}

// Decrypt function
function decrypt(text, key){
    return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
}

module.exports = {
    key_generator, encrypt, decrypt
}
