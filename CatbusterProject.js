const addProject = require('./db').addProject;
const selectProjectOptions = require('./db').selectProjectOptions;
const userSelectProject = require('./db').userSelectProject;
const getOpenBugList = require('./db').getOpenBugList;
const dict = require('./dictionary');

const handleCommand = (msg, command, callback) => {
    if (msg.chat.type !== 'private') {
        return false;
    }
    if (command.input.indexOf('/add_project') !== -1) {
        registerProject(msg, callback);
        return true;
    }
    if (command.input.indexOf('/projects') !== -1) {
        showRegisteredProjects(msg, callback);
        return true;
    }
    return false;
}

/**
 * This method will add new project to database.
 * @param msg
 * @param callback
 */
const registerProject = (msg, callback) => {
    callback(msg.chat.id, dict.askProvideProjectName(), {
        'reply_markup': {
            'force_reply': true,
        }
    })
};

/**
 * Show registered projects and allow user to subscribe to one of them using inline-keyboard.
 */
const showRegisteredProjects = (msg, callback) => {
    selectProjectOptions(msg, callback);
};

/**
 * Perform actions if replied message is connected with project actions.
 * @param msg
 * @param callback
 * @returns {boolean} whether the reply was made or not.
 */
const replyToMessage = (msg, callback) => {

    const handleRegistration = async() => {
        addProject(msg.text);
        callback(msg.chat.id, 'Проект был успешно добавлен!\nНе забудьте выбрать его командой /projects.', {})
    };

    if (dict.askProvideProjectName() === msg.reply_to_message.text) {
        handleRegistration();
        return true;
    }
    return false;
};

/**
 * Change user's selected project and display corresponding message.
 * @param msg
 * @param callback
 */
const selectProject = (msg, callback, sendMessage) => {
    let projectId = JSON.parse(msg.data).answer;
    userSelectProject(msg.from.id, projectId).then((projectName) => {
        callback(msg.id, projectName);
        getOpenBugList({from: msg.from, chat: msg.message.chat}, sendMessage);
    });
};

module.exports.handleCommand = handleCommand;
module.exports.replyToMessage = replyToMessage;
module.exports.selectProject = selectProject;
module.exports.showRegisteredProjects = showRegisteredProjects;
