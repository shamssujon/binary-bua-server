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
		const blogCollection = client.db("binaryBuaDB").collection("blogs");

		// Get all services from DB
		// limit data with query: items
		// ex: /services?items=3
		app.get("/services", async (req, res) => {
			const items = parseInt(req.query.items);
			let query = {};

			// Load user specific services with email query
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

		// Load all reviews
		// limit data with query: limit
		app.get("/reviews", async (req, res) => {
			const items = parseInt(req.query.limit);
			let query = {};

			// Load service specific reviews with service id query
			const id = req.query.id;
			if (id) {
				query = { serviceId: id };
			}

			// Load user specific reviews with email query
			const email = req.query.email;
			if (email) {
				query = { reviewerEmail: email };
			}

			const cursor = reviewCollection.find(query);
			const reviews = await cursor.limit(items).toArray();
			res.send(reviews);
		});

		// Delete a review from DB
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

		// Load Blogs from DB
		app.get("/blogs", async (req, res) => {
			const query = {};
			const cursor = blogCollection.find(query);
			const blogs = await cursor.toArray();
			res.send(blogs);
		});
	} finally {
	}
};

run().catch(console.dir);
