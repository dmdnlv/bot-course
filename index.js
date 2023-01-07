const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5924084658:AAGLRPHs-zlpY3ygWnjbRIzsSL5lHQPv67U'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I will think of a number from 0 to 9 and you have to guess it')
    const randomNumber = Math.floor(Math.random() * 10)
    console.log(randomNumber);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess the number', gameOptions);
}



const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Greetings'},
        {command: '/info', description: 'Get your info'},
        {command: '/game', description: 'Play the game'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Welcome to the chat`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'I dont\'t understand you, try once again')
    })

    bot.on('callback_query', msg => {
        const data  = msg.data;
        const chatId = msg.message.chat.id;
        if (data ==='/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            console.log(data);
            return bot.sendMessage(chatId, `Congrats, you guessed the right number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `You didn\'t guess the right number, the right number is ${chats[chatId]}`, againOptions)
        }
    })
}

start()