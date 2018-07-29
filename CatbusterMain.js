const dict = require('./dictionary');
const addOrActivateUser = require('./db').addOrActivateUser;
const disableUser = require('./db').disableUser;
const createOrUpdateChat = require('./db').createOrUpdateChat;
const activatePersonalChat = require('./db').activatePersonalChat;
const botUsername = require('./settings').settings.botUserName;

const mostUsedOptions = {
    reply_markup: {
        keyboard : [
            ["/projects", "/bugs", "/add_bug", "/stat"],
        ],
        resize_keyboard: true,
    }
};

const handleCommand = (msg, command, callback) => {
    if (command.input.indexOf('/hello') !== -1) {
        addOrActivateUser(msg.from);
        callback(msg.chat.id, dict.hello(msg.from), mostUsedOptions);
        return true;
    }
    if (command.input.indexOf('/hi') !== -1) {
        addOrActivateUser(msg.from);
        callback(msg.chat.id, dict.hello(msg.from), mostUsedOptions);
        return true;
    }
    if (command.input.indexOf('/greet') !== -1) {
        callback(msg.chat.id, dict.greetings(botUsername), {});
        return true;
    }
    if (command.input.indexOf('/start') !== -1) {
        newPersonalChatMember(msg, callback);
        return true;
    }
    return false;
};

/**
 * This method will add new members to database
 * @param msg
 * @param callback
 */
const newChatMembers = (msg, callback) => {
    if (msg.new_chat_members.length === 1) {
        let user = msg.new_chat_members[0];

        createOrUpdateChat(msg.chat.id, msg.chat.title);

        if (user.username === botUsername) {
            callback(msg.chat.id, dict.greetings(botUsername), {});
            return;
        }
    }

    for (let i = 0; i < msg.new_chat_members.length; i++) {
        let telegramUser = msg.new_chat_members[i];
        if (!telegramUser.is_bot)
            addOrActivateUser(telegramUser);
    }

    callback(msg.chat.id, dict.welcome(msg.new_chat_members), {})
};

/**
 * This method will deactivate users that left chat
 * @param msg
 */
const leftChatMember = (msg) => {
    disableUser(msg.left_chat_member);
};

/**
 * This method will assign personal chat with bot and user
 * @param msg
 * @param callback
 */
const newPersonalChatMember = (msg, callback) => {
    activatePersonalChat(msg.from, msg.chat.id);
    callback(msg.chat.id, dict.hello(msg.from), mostUsedOptions);
};

module.exports.newChatMembers = newChatMembers;
module.exports.leftChatMember = leftChatMember;
module.exports.newPersonalChatMember = newPersonalChatMember;
module.exports.handleCommand = handleCommand;
