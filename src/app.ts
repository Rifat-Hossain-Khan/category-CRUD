import express from "express";
import config from "config";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/connect";

const port = config.get<number>("port");

const app = express();

app.use(cors());

app.use(express.json());

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
