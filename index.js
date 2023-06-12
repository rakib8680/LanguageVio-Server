const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crku76a.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const usersCollection = client.db('languageVio').collection('users');
    const cartCollection = client.db('languageVio').collection('cart');
    const classCollection = client.db('languageVio').collection('classes');




    // user collection 
    // save user detail and role in db 
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      res.send(result)
    });

    // Get user
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await usersCollection.findOne(query)
      res.send(result)
    });

    // get all user 
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })







    // cart collection 
    // post cart 
    app.post('/cart', async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item)
      res.send(result)
    });

    // get Cart items
    app.get('/cart', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    // delete cart items 
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })







    // class collection 
    // get all classes 
    app.get('/classes', async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result)
    });


    // Update A class
    app.patch('/classes/:id', async (req, res) => {
      const singleClass = req.body
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          ...singleClass
        }
      }
      const result = await classCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // add class to db 
    app.post('/classes', async (req, res) => {
      const classData = req.body;
      const result = await classCollection.insertOne(classData);
      res.send(result)
    });

    // get teacher specified classes 
    app.get('/classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'email': email };
      const result = await classCollection.find(query).toArray();
      res.send(result)
    });

     // get single class 
     app.get('/class/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)










app.get('/', (req, res) => {
  res.send('languagevio Server is running..')
})

app.listen(port, () => {
  console.log(`languagevio is running on port ${port}`)
})
