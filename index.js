const express = require('express')
const https = require('https');
const fs = require('fs');

const app = express()
const port = 3117
const {generateToken,decodeToken,generateUUID} = require('./utils')
const {insertInto,activateToken} = require('./mongodb')

const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/auth.effysurreal.codes/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/auth.effysurreal.codes/fullchain.pem')
  };

app.get('/', (req, res) => {
  res.send('Hello Worldasdsd!')
})

app.get('/auth/haha',(req,res) => {
	res.send("auth haha!!")
})

app.get('/auth/gen',async(req,res) => {
	// const token = generateToken({name:'effy'})
	// const info = decodeToken(token)
	// console.log(generateUUID())
	const uuid= await insertInto({name:'kaka'})
	res.set('Content-Type', 'text/html');
	res.send(Buffer.from(`<a href="/auth/activate/${uuid}">Link</a>`))

})

app.get('/auth/activate/:uuid',async(req,res) =>{
	const uuid = req.params.uuid
	const data = await activateToken(uuid)
	console.log(data)
	res.redirect('/activate')
})

app.get('/activate',(req,res) => {
	res.send('Activate Success!')
})



https.createServer(options,app).listen(port);
