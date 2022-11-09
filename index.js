// @ts-nocheck
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

		// Get all services from DB
		app.get("/services", async (req, res) => {
			const query = {};
			const cursor = serviceCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});
	} finally {
	}
};

run().catch(console.dir);
