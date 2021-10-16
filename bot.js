require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });

bot.on('voice', (msg) => {
  const stream = bot.getFileStream(msg.voice.file_id);

  let chunks = [];
  
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', async () => {
    const axiosConfig = {
      method: 'POST',
      url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
      headers: {
        Authorization: `Api-Key ${process.env.API_YA_KEY}`,
      },
      data: Buffer.concat(chunks),
    };
    try {
      const response = await axios(axiosConfig)
      const {result} = response.data;
      const chatId = msg.chat.id;
      const userName = msg.from.first_name;
      bot.sendMessage(chatId, `${userName} говорит:\n${result}`)
    } catch (error) {
      console.log('Error:', error);
    }
    });
  });

