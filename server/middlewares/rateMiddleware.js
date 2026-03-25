import rateLimit from "express-rate-limit";

// General API limiter (overall protection)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,                 // 300 requests per IP per 15 min
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Bohat zyada requests, thori dair baad try karein." },
});

// Auth routes limiter (login/register etc)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                  // 20 attempts
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Auth attempts zyada ho gaye. Thori dair baad try karein." },
});