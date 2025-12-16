import {User} from "../models/user.models.js";
import {ApiResponse} from "../utils/api-reponse.js";
import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        
        return {accessToken, refreshToken};
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating tokens", [error]);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // destructuring coming data
    const {email, username, password, role} = req.body;

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    // Check in DB if user already exists
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user", [])
    }

    return res.status(201).json(new ApiResponse(201, "User registered successfully. Please check your email to verify your account", {user: createdUser}))
});

const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body;

    if(!email){
        throw new ApiError(400, "email is required to login")
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User not found with this email")
    }

    const isPasswordValid = user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials. Please check your email and password")
    }

    const tokens = await generateAccessTokenAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while logging in user")
    }

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("accessToken", tokens.accessToken, options).cookie("refreshToken", tokens.refreshToken, options).json(new ApiResponse(200, "User logged in successfully", {user: loggedInUser}))
})
export {registerUser, login};