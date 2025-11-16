import { ApiResponse } from "../utils/api-reponse.js";
import {asyncHandler} from "../utils/async-handler.js";

// Health Check Controller using asyncHandler
const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, {message: "Server is running"}, "API is healthy"));
});

// Alternative without asyncHandler and without async/await
/*
const healthCheck = (req, res) => {
    try{
        res.status(200).json(new ApiResponse(200, {message: "Server is running"}, "API is healthy"));
    }catch(err){  
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
};
*/
// Alternative without asyncHandler and async/await
/*
const healthCheck = async(req, res, next) => {
    try{
        const user = await getUserFromDB(); // Example async operation
        res.status(200).json(new ApiResponse(200, {message: "Server is running"}, "API is healthy"));
    }catch(err){
        next(err);
    }
}
*/


export { healthCheck };