import { capitalizeFirstLetter } from "./utils/capitalizeFirstLetter"

const { Composer } = require('telegraf')

const startCommand = Composer.command('/start', async (ctx: any) => {
  const msg = `
Hello, this bot helps you write a title following fast & furious naming scheme

Example: /ff <title1> <title2>

Naming scheme:
The Fast and the Furious
2 Fast 2 Furious
The Fast and the Furious: Tokyo Drift
Fast & Furious
Fast Five
Fast & Furious 6
Furious 7
The Fate of the Furious
F9
Fast X
  `

  await ctx.reply(msg)
})

const ffCommand = Composer.command('/ff', async (ctx: any) => {
  if (!ctx.message){
    return;
  }

  const text = ctx.message.text;
  const args = text.split(' ');
  if (args.length !== 3) {
    await ctx.reply('Need 2 arguments');
  }

  const title1 = capitalizeFirstLetter(args[1]);
  const title2 = capitalizeFirstLetter(args[2]);
  const title1Letter = title1[0];

  const msg = `
The ${title1} and the ${title2}
2 ${title1} 2 ${title2}
The ${title1} and the ${title2}: Tokyo Drift
${title1} & ${title2}
${title1} Five
${title1} & ${title2} 6
${title2} 7
The Fate of the ${title2}
${title1Letter}9
${title1} X
  `

  await ctx.reply(msg)
})

const inlineQuery = Composer.on('inline_query', async (ctx: any) => {
  const { id, query } = ctx.inlineQuery;

  console.log(ctx.inlineQuery)

  // try {
  //   bot.telegram.answerInlineQuery(id, [
  //     {
  //       type: 'article',
  //       id: meetingId,
  //       title: meetingName,
  //       input_message_content: {
  //         message_text: message,
  //       },
  //       reply_markup: {
  //         inline_keyboard: [
  //           [
  //             { text: 'Start bot to begin', url: `https://t.me/${process.env.BOT_USERNAME}?start=${query}` },
  //           ],
  //         ],
  //       },
  //     },
  //   ], {
  //     cache_time: 1,
  //   });
  // } catch (err) {
  //   logger.error(err);
  // }
});

export const botComposer = [
  startCommand,
  ffCommand,
  inlineQuery
]
