import { betterAuth } from "better-auth";
import config from "../config/env";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(config.databaseUrl);
const db = client.db();


export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    linkedin:{
      clientId: config.linkedIn.clientID,
      clientSecret: config.linkedIn.secret,
    }
  },
  trustedOrigins: [config.clientURL],
});