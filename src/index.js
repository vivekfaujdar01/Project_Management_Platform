import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 3000;

//connect to database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}).catch((err)=> {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
