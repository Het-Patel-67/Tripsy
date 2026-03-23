import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong from controller")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            message: 'Please provide a valid email address.'
        });
    }
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+=\[\]{}|;:'",.<>\/?`])(?!.*\s).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password is too weak.'
        });
    }
    
    if ([username, password, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    const existedUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    const newUser = await User.create({
        username: username.toLowerCase(),
        password,
        email,
    })

    const createdUser = await User.findById(newUser._id).select("-password -__v -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }
    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!(email || username)) {
        throw new ApiError(400, 'Username or email is required from controller')
    }
    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )
    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordMatch(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password from controller")
    }

    // send it to server to fetch tokens
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

    // Not required
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // To secure cookies with read only mode
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options) // Tokens sent to cookies
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully from controller"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token expired");
    }

    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessandRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            accessToken,
            refreshToken: newRefreshToken,
        });
});

export { registerUser, loginUser, refreshAccessToken };