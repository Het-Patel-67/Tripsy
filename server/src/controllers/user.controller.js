import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validator from "validator";

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong generating token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, mobile } = req.body;
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            message: "Please provide a valid email address.",
        });
    }

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+=\[\]{}|;:'",.<>\/?`])(?!.*\s).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({ message: "Password is too weak." });
    }

    if ([username, password, email, mobile].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ mobile }, { email: email.toLowerCase() }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        mobile,
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -__v -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }

    const isPasswordValid = await user.isPasswordMatch(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    const { accessToken } = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken },
            "User logged in successfully"
        )
    );
});

// GET /api/users/me
// Called by AuthContext on app load to restore session from localStorage token.
// verifyJWT runs first — if token is missing/expired it returns 401 automatically.
const getMe = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Authenticated"));
});

// POST /api/users/logout
// Stateless logout — client simply discards the token from localStorage.
// No server-side action needed, but endpoint kept for consistency.
const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { registerUser, loginUser, getMe, logoutUser };