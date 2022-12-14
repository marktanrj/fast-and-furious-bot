import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Telegraf } from "telegraf";
import { botComposer } from "./bot";

export const createApp = async () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const bot = new Telegraf(process.env.BOT_TOKEN!);
  bot.use(...botComposer);

  app.use(bot.webhookCallback('/webhook'));

  app.get('/', (req, res) => {
    res.send('Server running');
  });

  return { app, bot };
};
