const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173',
    "https://library-management-86cd6.web.app",
    "https://library-management-86cd6.firebaseapp.com"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s2dzxgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const logger = async (req, res, next) => {
  console.log('called:', req.host, req.originalUrl);
  next();
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log('Value of the token is: ', token);
  if (!token) {
    return res.status(401).send({ message: 'not authorized' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error is: ', err);
      return res.status(401).send({ message: 'unauthorized access' })
    }
    console.log('value in the token', decoded);
    req.user = decoded;
    next();
  })
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const booksCollection = client.db('libraryBooks').collection('books');
    const borrowBooksCollection = client.db('libraryBooks').collection('borrow')
    const addedBooksCollection = client.db('libraryBooks').collection('addedBooks');

    app.post('/jwt', logger, async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, cookieOptions)
        .send({ success: true });
    });
    //clearing Token
    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("logging out", user);
      res
        .clearCookie("token", { ...cookieOptions, maxAge: 0 })
        .send({ success: true });
    });

    app.get('/books', async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })


    app.get('/books/:category', async (req, res) => {
      try {
        const category = req.params.category;
        const query = { category: category };
        const cursor = booksCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching books by category:", error);
        res.status(500).send("Internal server error");
      }
    })

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await booksCollection.findOne(query);
      res.send(result);
    })
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await borrowBooksCollection.deleteOne(query);
      res.send(result);
    })


    app.put('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          image: updatedBook.image,
          name: updatedBook.name,
          author_name: updatedBook.author_name,
          category: updatedBook.category,
          rating: updatedBook.rating
        }
      }

      const result = await booksCollection.updateOne(filter, book, options);
      res.send(result);
    })

    // borrowed books
    app.get('/borrow', verifyToken, logger, async (req, res) => {
      if (req.query.email !== req.user.email) {
        return res.status(403).send({ message: 'Forbidden Access' })
      }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await borrowBooksCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/book/:id', async (req, res) => {
      const book = req.body;
      const result = await borrowBooksCollection.insertOne(book);
      res.send(result);
    });

    app.patch('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateBook = req.body;
      console.log(updateBook);
      const updateDoc = {
        $set: {
          status: updateBook.status
        },
      };
      const result = await borrowBooksCollection.updateOne(filter, updateDoc);
      res.send(result);
    })




    // For Added Books

    // app.get('/added', async (req, res) => {
    //   const cursor = addedBooksCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    app.get('/added', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      try {
        const result = await addedBooksCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching added books:", error);
        res.status(500).send("Internal server error");
      }
    })

    app.post('/added/:id', async (req, res) => {
      const newBook = req.body;
      try {
        const result = await addedBooksCollection.insertOne(newBook);
        res.send(result);
      } catch (error) {
        console.error("Error adding new book:", error);
        res.status(500).send("Internal server error");
      }
    })

    // Send a ping to confirm a successful connection
    //  await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Librarian is running')
})

app.listen(port, () => {
  console.log(`Librarian is running on port: ${port}`);
})