import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongodburl: process.env.MONGO_URL,
  port:process.env.PORT,
  api_version : process.env.API_VERSION,
  community_url: process.env.COMMUNITY_URL
};