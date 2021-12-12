import express from "express";
import { handleHome } from "./controllers";

export const globalRouter = express.Router();
globalRouter.get("/", handleHome);