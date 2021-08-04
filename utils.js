const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const KEY =  process.env.JWT_ACCESS_KEY
const expiryTime = process.env.JWT_TOKEN_DURATION

const generateToken = (userInfoObj) => {
	const token = jwt.sign(userInfoObj,KEY,{expiresIn:expiryTime});
	return token
}

const decodeToken = (token)=>{
	return jwt.decode(token,KEY)
}

const generateUUID = ()	=>{
	return uuidv4()
}


exports.generateToken=generateToken
exports.decodeToken=decodeToken
exports.generateUUID=generateUUID