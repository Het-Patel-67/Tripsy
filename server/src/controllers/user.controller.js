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
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, mobile } = req.body;
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
    
    if ([username, password, email, mobile].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    const existedUser = await User.findOne({ $or: [{ mobile }, { email: email.toLowerCase() }, { username }] });
    
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    const newUser = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        mobile
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
        throw new ApiError(400, 'Username or email is required')
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
        throw new ApiError(401, "Invalid Password")
    }

    // send it to server to fetch tokens
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

    // Not required
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

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
                "User logged in successfully"
            )
        )
})
// GET /api/users/me
// Called by AuthContext on every app load to restore session from cookie.
// verifyJWT runs first — if cookie is missing/expired it returns 401 automatically.
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Authenticated"));
})

// POST /api/users/logout
// Clears both httpOnly cookies and removes refreshToken from DB.
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
 
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };
 
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

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
        sameSite: "none",
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

export { registerUser, loginUser, refreshAccessToken, getMe, logoutUser };