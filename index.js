import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});
let myusername = process.env.username;
console.log("Starting the backend server...");
console.log("Username from .env file:", myusername);