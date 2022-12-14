import { capitalizeFirstLetter } from "./utils/capitalizeFirstLetter"
import { Composer } from 'telegraf';

type ProcessedInputs = {
  title1: string,
  title1Letter: string,
  title2: string,
  title3: string,
}

const startCommand = Composer.command(['/start', '/help'], async (ctx: any) => {
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
  try {
    await validateCommandInput(ctx);
    const text = ctx.message.text;
    const processedInputs = inputParser(text)
    const message = formatMessage(processedInputs)
    await ctx.reply(message)
  } catch (error: any) {
    console.log(error);
    ctx.reply('Error: ' + error.message)
    return;
  }
})

const inlineQuery = Composer.on('inline_query', async (ctx: any) => {
  try {
    await validateInlineQueryInput(ctx);
    const text = ctx.inlineQuery.query;
    const textModified = "/ff " + ctx.inlineQuery.query; // add /ff to make it work with inputParser when splitted and indexed
    const processedInputs = inputParser(textModified)
    const message = formatMessage(processedInputs)

    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, [
      {
        type: 'article',
        id: new Date().toString(),
        title: text,
        input_message_content: {
          message_text: message,
        },
      },
    ], {
      cache_time: 1,
    });

  } catch (error: any) {
    console.log(error);
    return;
  }
});

async function validateInlineQueryInput(ctx: any) {
  if (!ctx.inlineQuery){
    throw new Error('No inline query');
  }
  const text = ctx.inlineQuery.query;
  const args = text.split(' ');
  if (args.length < 2) {
    throw new Error('Need 2 arguments');
  }
}

async function validateCommandInput(ctx: any) {
  if (!ctx.message){
    throw new Error('No message');
  }
  const text = ctx.message.text;
  const args = text.split(' ');
  if (args.length < 3) {
    await ctx.reply('Need 2 arguments');
    throw new Error('Need 2 arguments');
  }
}

function inputParser(text: string) {
  const args = text.split(' ');
  const title1 = capitalizeFirstLetter(args[1]);
  const title1Letter = title1[0];
  const title2 = capitalizeFirstLetter(args[2]);

  let title3 = 'Tokyo Drift';
  if (args.length > 3) {
    title3 = args.slice(3).join(' ');
  }

  return {
    title1,
    title1Letter,
    title2,
    title3
  }
}

function formatMessage({
  title1,
  title1Letter,
  title2,
  title3
}: ProcessedInputs) {
  const msg = `
The ${title1} and the ${title2}
2 ${title1} 2 ${title2}
The ${title1} and the ${title2}: ${title3}
${title1} & ${title2}
${title1} Five
${title1} & ${title2} 6
${title2} 7
The Fate of the ${title2}
${title1Letter}9
${title1} X`

  return msg;
}

export const botComposer = [
  startCommand,
  ffCommand,
  inlineQuery
]
