import { config } from 'dotenv';

config();

export default {
  secret: process.env.JWT_SECRET || "mystore-secret-key"
};