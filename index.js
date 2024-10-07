const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());





// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8iiotm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://tradeNest:tj51ai9BoblYv4rj@cluster0.y8iiotm.mongodb.net/tradeNestDB?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const usersCollection = client.db("tradeNestDB").collection("uses")

    // save a user data in db
    app.put('/user', async (req, res) => {
        const user = req.body
  
        const query = { email: user?.email }
        // check if user already exists in db
        const isExist = await usersCollection.findOne(query)
        if (isExist) {
          if (user.status === 'Requested') {
            // if existing user try to change his role
            const result = await usersCollection.updateOne(query, {
              $set: { status: user?.status },
            })
            return res.send(result)
          } else {
            // if existing user login again
            return res.send(isExist)
          }
        }
  
        // save user for the first time
        const options = { upsert: true }
        const updateDoc = {
          $set: {
            ...user,
            timestamp: Date.now(),
          },
        }
        const result = await usersCollection.updateOne(query, updateDoc, options)
        res.send(result)
      })
  







    





    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('e-commerce is running')
})
app.listen(port,()=>{
    console.log(`e-commerce server is running on port ${port}`)
})