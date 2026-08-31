import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xssClean from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import chatRoutes from "./routes/chat.routes.js";
import errorHandler from "./middleware/error-handler.middleware.js";

const app = express();

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "https://localhost:5173",
    "https://localhost:5174",
].filter(Boolean);

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
        },
    })
);
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.disable("x-powered-by");
app.use(
    cors({
        origin: (origin, callback) => {
            if (
                !origin ||
                allowedOrigins.includes(origin) ||
                /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error(`CORS origin denied: ${origin}`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type"],
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(xssClean());
app.use(mongoSanitize());
app.use(hpp());

app.use("/api/chat", apiLimiter, chatRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});
app.use(errorHandler);
export default app;
