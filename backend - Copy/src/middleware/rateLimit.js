import rateLimit from "express-rate-limit";

// Rate limit for login routes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for refresh token route
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 refresh requests per minute
  message: {
    success: false,
    message: "Too many refresh attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
