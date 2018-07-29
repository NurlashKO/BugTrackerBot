/**
 * Created by Daniq on 19.01.2018.
 * 
 * This is the main Javascript file that should be launched
 */
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const CatbusterMain = require('./CatbusterMain');
const CatbusterProject = require('./CatbusterProject');
const CatbusterBug = require('./CatbusterBug');
const dict = require('./dictionary');
const settings = require('./settings').settings;

// Setup connection to Database

setTimeout(function() { 
mongoose.connect('mongodb://mongo:27017/busterbot');
; }, 5000);

// Setting bot
const bot = new TelegramBot(settings.token, {polling: true});
const botUsername = settings.botUserName;

// Common send message callback
const sendMessage = (chatId, answer, options) => {
    bot.sendMessage(chatId, answer, options);
};

const answerCallbackQuery = (chatId, data) => {
    bot.answerCallbackQuery(chatId, data);
};


// This will be called when new member is added
bot.on('new_chat_members', (msg) => {
    CatbusterMain.newChatMembers(msg, sendMessage);
});

// This will be called when member of chat is left
bot.on('left_chat_member', (msg) => {
    CatbusterMain.leftChatMember(msg);
});

// Entered command
bot.onText(/\/[A-Z]/gi, (msg, match) => {
    let handled =
        CatbusterMain.handleCommand(msg, match, sendMessage) ||
        CatbusterProject.handleCommand(msg, match, sendMessage) ||
        CatbusterBug.handleCommand(msg, match, sendMessage);
    if (!handled) {
        sendMessage(msg.chat.id, dict.unknownCommand(match.input), {});
    }
});

// This will be called when chat participants will answer to question
bot.on('callback_query', (msg) => {
    let sender = JSON.parse(msg.data).sender;
    if (sender === 'projects') {
        CatbusterProject.selectProject(msg, (callbackQueryId, projectName) => {
            bot.answerCallbackQuery(callbackQueryId, {text: `Запомнили.\nИзбранный: ${projectName}`})
        }, sendMessage);
    }
    if (sender === 'bug_show') {
        CatbusterBug.showBug(msg, bot);
    }
    if (sender === 'bug_change_status') {
        CatbusterBug.changeBugStatus(msg, {sendMessage: sendMessage, answerCallbackQuery: answerCallbackQuery});
    }
});


// Global
bot.on('message', (msg) => {
    // If someone replied to message
    if (!msg.reply_to_message || msg.reply_to_message.from.username !== botUsername) {
        return;
    }
    CatbusterProject.replyToMessage(msg, sendMessage);
    CatbusterBug.replyToMessage(msg, sendMessage);
});


// If some Polling error happened
bot.on('polling_error', (msg) => {
    console.error(msg);
});


module.exports.sendMessage = sendMessage;
