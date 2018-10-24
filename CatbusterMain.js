const dict = require('./dictionary');
const createOrUpdateChat = require('./db').createOrUpdateChat;
const activatePersonalChat = require('./db').activatePersonalChat;
const botUsername = require('./settings').settings.botUserName;
const authorization = require('./settings').authorization;

const mostUsedOptions = {
    reply_markup: {
        keyboard : [
            ["/projects", "/bugs", "/add_bug"],
        ],
        resize_keyboard: true,
    }
};

const handleCommand = (msg, command, callback) => {
    if (command.input.indexOf('/hi') !== -1) {
        newPersonalChatMember(msg, callback);
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
 * This method will assign personal chat with bot and user
 * @param msg
 * @param callback
 */
const newPersonalChatMember = (msg, callback) => {
    if (authorization.isRequired) {
        callback(msg.chat.id, dict.promptAuthPassword(authorization.passwordHint), {
            'reply_markup': {
                'force_reply': true,
            }
        });
        return
    }
    activatePersonalChat(msg.from, msg.chat.id);
    callback(msg.chat.id, dict.hello(msg.from), mostUsedOptions);
};

/**
 * Perform actions if replied message is connected with project main actions.
 * @param msg
 * @param callback
 * @returns {boolean} whether the reply was made or not.
 */
const replyToMessage = (msg, callback) => {
  const handleAuthorization = async() => {
      if (msg.text === authorization.password) {
          activatePersonalChat(msg.from, msg.chat.id);
          callback(msg.chat.id, dict.hello(msg.from), mostUsedOptions);
      } else {
          callback(msg.chat.id, 'Wrong password :(', {})
      }
  };
  if (dict.promptAuthPassword(authorization.passwordHint) === msg.reply_to_message.text) {
    handleAuthorization();
    return true;
  }
  return false;
};

module.exports.newChatMembers = newChatMembers;
module.exports.newPersonalChatMember = newPersonalChatMember;
module.exports.handleCommand = handleCommand;
module.exports.replyToMessage = replyToMessage;
