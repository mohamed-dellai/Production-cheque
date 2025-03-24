import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export default genAI;