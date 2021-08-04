const { MongoClient } = require("mongodb");
const {generateToken,decodeToken,generateUUID} = require('./utils')
// Connection URI
const uri =
  "mongodb://localhost:27017";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run(userObj) {
  let data
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    
    console.log("Connected successfully to server");
    const db = client.db('test')
    data = await db.collection('users').findOne(userObj)

    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return data
}
run().catch(console.dir);

const insertInto = async (userInfoObj) => {

	userInfoObj.token=generateToken(userInfoObj)
	userInfoObj.uuid=generateUUID()
	userInfoObj.activated = false

	try{
		await client.connect()
		// Establish and verify connection
		await client.db("admin").command({ ping: 1 });
    
		console.log("Connected successfully to server");
		const db = client.db('test')
		const collection = db.collection('users')
		await collection.insertOne(userInfoObj)
		console.log('inserted success!')
		
	} finally{
		 // Ensures that the client will close when you finish/error
		 await client.close();
	}

	return userInfoObj.uuid
}

const activateToken = async (uuid)=>{
	let result
	try{
		await client.connect()
		const db = client.db('test')
		const collection = db.collection('users')
		const newValue = {
			$set:{
				activated:true
			}
		}
		await collection.updateOne({uuid},newValue)
		console.log("activated link!")
		result = await collection.findOne({uuid})
	} finally{
		await client.close()
	}
	return result
}

exports.insertInto=insertInto
exports.activateToken=activateToken