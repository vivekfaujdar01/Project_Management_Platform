import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//basic middlewares for parsing json and urlencoded data and serving static files from 'public' directory
//basic configuration
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true ,limit: '16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

//enable CORS or CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// import the routes
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import authRoutes from "./routes/auth.routes.js";

// use the auth routes
app.use("/api/v1/auth", authRoutes);
// use the routes
app.use("/api/v1/healthcheck", healthcheckRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;