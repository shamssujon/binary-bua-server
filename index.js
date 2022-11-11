// @ts-nocheck
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7700;

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Binary Bua server is running");
});

app.listen(port, () => {
	console.log(`Binary bua server is running on port: ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9q7qmdx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const run = async () => {
	try {
		const serviceCollection = client.db("binaryBuaDB").collection("services");
		const reviewCollection = client.db("binaryBuaDB").collection("reviews");

		// Get all services from DB
		// limit data with query: items
		// ex: /services?items=3
		app.get("/services", async (req, res) => {
			const items = parseInt(req.query.items);
			let query = {};

			// Load user specific orders with email query
			const email = req.query.email;
			if (email) {
				query = { customerEmail: email };
			}

			const cursor = serviceCollection.find(query);
			const services = await cursor.limit(items).toArray();
			res.send(services);
		});

		// Load single service from DB
		app.get("/services/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await serviceCollection.findOne(query);
			res.send(service);
		});

		// Get a service from client, send to DB
		app.post("/services/service/add", async (req, res) => {
			const service = req.body;
			service.dateAdded = new Date();
			const result = await serviceCollection.insertOne(service);
			res.send(result);
		});

		// Get review from client, send to DB
		app.post("/review/add", async (req, res) => {
			const review = req.body;
			review.dateAdded = new Date();
			const result = await reviewCollection.insertOne(review);
			res.send(result);
		});
	} finally {
	}
};

run().catch(console.dir);
