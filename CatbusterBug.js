const showRegisteredProjects = require('./CatbusterProject').showRegisteredProjects;
const getUserProject = require('./db').getUserProject;
const getOpenBugList = require('./db').getOpenBugList;
const getBugStatusOptions = require('./db').getBugStatusOptions;
const addBug = require('./db').addBug;
const getBug = require('./db').getBug;
const updateBugStatus = require('./db').updateBugStatus;
const addBugComment = require('./db').addBugComment;
const dict = require('./dictionary');

const handleCommand = (msg, command, callback) => {
    if (msg.chat.type !== 'private') {
        return false;
    }
    
    if (command.input.indexOf('/add_bug') !== -1) {
        if (needToSelectProject(msg, callback)) {
            return true;
        }
        registerBug(msg, callback);
        return true;
    }

    if (command.input.indexOf('/bugs') !== -1) {
        if (needToSelectProject(msg, callback)) {
            return true;
        }
        getOpenBugList(msg, callback);
        return true;
    }
    return false;
};

const needToSelectProject = (msg, callback) => {
    let project = getUserProject(msg.from.id);
    if (!project || project === "") {
        callback(msg.chat.id, `Вы не выбрали проект! :(`, {})
        showRegisteredProjects(msg, callback);
        return true;
    }
    return false;
};

/**
 * This method will add new project to database.
 * @param msg
 * @param callback
 */
const registerBug = (msg, callback) => {
    callback(msg.chat.id, dict.askProvideBugShortDescription(), {
        'reply_markup': {
            'force_reply': true,
        }
    })
};

/**
 * Perform actions if replied message is connected with bug actions.
 * @param msg
 * @param callback
 * @returns {boolean} whether the reply was made or not.
 */
const replyToMessage = async(msg, callback) => {
    const handleRegistration = async() => {
        let bug = await addBug(msg.from.id, msg.text);
        if (bug) {
            callback(msg.chat.id, 'Баг был успешно создан!', {})
            callback(msg.chat.id, dict.showBugInfo(bug), {});
        }
    };
    let replyText = msg.reply_to_message.text;
    if (replyText === dict.askProvideBugShortDescription()) {
        handleRegistration();
        return true;
    }
    if (replyText.indexOf('Баг #') > -1) {
        let bugId = replyText.substring(replyText.indexOf('#')+1, replyText.indexOf('\n'));
        updateBugComments(bugId, msg, callback);
    }
    return false;
};

const showBug = async(msg, bot) => {
    let bugId = JSON.parse(msg.data).answer;
    let bug = await getBug(bugId);
    await bot.sendMessage(msg.message.chat.id, dict.showBugInfo(bug), getBugStatusOptions(bug));
    bot.answerCallbackQuery(msg.id, {text: ''});
    for (message of bug.comments) {
        await bot.forwardMessage(msg.message.chat.id, message.chat_id, message.id);
    }
    //bot.sendMessage(msg.message.chat.id, "Изменить статус бага", );
};

const updateBugComments = (bugId, msg, callback) => {
    let message = {
        chat_id: msg.chat.id,
        id: msg.message_id,
    };
    if (addBugComment(bugId, message)) {
        callback(msg.chat.id, 'Комментарий добавлен.');
    }
};

const changeBugStatus = async(msg, botFunctions) => {
    let data = JSON.parse(msg.data).answer;
    await updateBugStatus(data.id, data.status);
    botFunctions.answerCallbackQuery(msg.id, {text: `Bug #${data.id} status have been changed!`});
    getOpenBugList({from: msg.from, chat: msg.message.chat}, botFunctions.sendMessage);
};



module.exports.handleCommand = handleCommand;
module.exports.replyToMessage = replyToMessage;
module.exports.showBug = showBug;
module.exports.changeBugStatus = changeBugStatus;
