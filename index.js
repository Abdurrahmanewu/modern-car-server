const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdfs3t2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const serviceCollection = client.db("modern-car").collection("services");
    const orderCollection = client.db("modern-car").collection("orders");

    // Service API

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const service = await serviceCollection.findOne(quary);
      res.send(service);
    });

    // Orders API

    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursore = orderCollection.find(query);
      const orders = await cursore.toArray();
      res.send(orders);
    });
    // app.get("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const quary = { _id: new ObjectId(id) };
    //   const result = await orderCollection.findOne(quary);
    //   res.send(result);
    // });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((e) => console.error(e));

app.get("/", (req, res) => {
  res.send("car server is running");
});
app.listen(port, () => {
  console.log(`car server is running on ${port}`);
});
