import express from "express";
import { setRoutes } from "./routes/index";
import { toNodeHandler } from "better-auth/node";
import errorHandler from "./middlewares/errorHandler";
import config from "./config/env";
import cors from "cors";
import { auth } from "./utils/auth";

const app = express();

app.use(
  cors({
    origin: config.clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
setRoutes(app);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});