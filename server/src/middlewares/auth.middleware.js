import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Read token exclusively from Authorization header (Bearer token flow).
        // Cookie fallback removed — cross-site cookies are blocked by default
        // in modern browsers when frontend and backend are on different origins.
        const authHeader = req.header("Authorization");
        const token =
            authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            throw new ApiError(401, "Unauthorized request — no token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError(401, error?.message || "Invalid access token"));
    }
});

export { verifyJWT };