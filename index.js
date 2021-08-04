const express = require('express')
const app = express()
const port = 3117
const {generateToken,decodeToken,generateUUID} = require('./utils')
const {insertInto,activateToken} = require('./mongodb')

// console.log(token)
// console.log(decodeToken(token))

app.get('/', (req, res) => {
  res.send('Hello World!')
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



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

