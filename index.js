const express = require('express')
const https = require('https');
const fs = require('fs');
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use('/login',express.static(__dirname + '/'));
app.use('/test',express.static(__dirname + '/public'))
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', __dirname);

const port = 3117
const {generateToken,decodeToken,generateUUID} = require('./utils')
const {insertInto,activateToken,checkTokenValidity} = require('./mongodb')

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

app.post('/auth/gen2',async(req,res) => {
	// const token = generateToken({name:'effy'})
	// const info = decodeToken(token)
	// console.log(generateUUID())
	console.log(req.body)
	console.log("asdasd")
	const uuid= await insertInto(req.body)
	// res.set('Content-Type', 'text/html');
	// res.send(Buffer.from(`<a href="/auth/activate/${uuid}">Link</a>`))
	res.json({
		status:'success',
		uuid
	})

})



app.get('/auth/activate/:uuid',async(req,res) =>{
	const uuid = req.params.uuid
	const data = await activateToken(uuid)
	if (data === "already"){
		res.send("Link already used!")
		return 
	}
	const token = data.token
	// res.redirect('/activate')
	
	// res.set('Content-Type', 'text/html');
	// const script = 'alert(' + txt + ')'
	// const htmlStr = '<script>' + script + '</script>'
	// res.end(htmlStr)
	const cookirStr = `hey=${token}; domain=effysurreal.codes; Max-Age=2592000; path=/`
	// const cookirStr2 = `credentials=${uuid}; domain=effysurreal.codes; Max-Age=2592000; path=/`
	res.set('Set-Cookie',cookirStr)
	// res.set('Set-Cookie',cookirStr2)
	// res.render('index.html',{
	// 	token:data.token
	// })
	res.send('helasdlo!')
})

app.get('/activate',(req,res) => {
	res.send('Activate Success!')
})


app.post('/auth/check',async(req,res) => {
	const token = req.body.token
	const validityResult = await checkTokenValidity(token)
	console.log('the result is: ', validityResult)
	if  (validityResult === undefined){
		console.log("token not found!")
		
	}else{
		console.log("Token valid!")
	}

	const tokenDecoded = decodeToken(token)
	console.log(tokenDecoded)
	console.log(Date.now()/1000,tokenDecoded.exp)
	if (Date.now()/1000  >= tokenDecoded.exp){
		console.log("Token expired!")
		res.json({
			msg: 'failed'
		})
	}else{
		console.log("Token still valid!")
		res.json({
			msg: 'valid'
		})
	}
	
	
})

app.get('/newform',(req,res) => {
	res.send('New form! Please register!')
})

app.get('/validated',(req,res) => {
	res.send("Validated! redirecting you to secret page!")
})



https.createServer(options,app).listen(port);
