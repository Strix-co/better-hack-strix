import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGODB_URI || "",
  environment: process.env.NODE_ENV || "development",
  linkedIn: {
    clientID: process.env.LINKEDIN_CLIENT_ID as string,
    secret: process.env.LINKEDIN_CLIENT_SECRET as string
  },
  clientURL: process.env.CORS_ORIGIN || "",
};

export default config;