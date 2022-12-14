const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') });

import serverless from 'serverless-http';
import { createApp } from './app';
import { isProductionEnv } from './utils/isProductionEnv';

(async () => {
  if (!isProductionEnv) {
    const { app, bot } = await createApp();
    const port = 4000;
    app.listen(port, async () => {
      bot.launch();
      console.log('Bot started in polling mode')
    });
  }
})();

if (isProductionEnv) {
  exports.handler = async (event: any, context:any) => {
    const { app } = await createApp();
    const handler = serverless(app);
    try {
      const result = await handler(event, context);
      return result;
    } catch (err: any) {
      return err;
    }
  };
}
