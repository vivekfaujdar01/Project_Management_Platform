import express from "express";
import cors from "cors";

const app = express();

//basic middlewares for parsing json and urlencoded data and serving static files from 'public' directory
//basic configuration
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true ,limit: '16kb'}));
app.use(express.static("public"));

//enable CORS or CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;