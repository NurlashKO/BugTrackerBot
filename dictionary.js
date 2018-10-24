/**
 * This file contains all possible replies of bot
 */

let dateFormat = require('dateformat');
const BugStatusEnum = require('./db').BugStatusEnum;

/**
 * Basic greeting variants. When bot added for first time to group this will be shown
 * @param botUsername
 * @returns {string}
 */
const greetings = (botUsername) => {
    let variants = [
        `Привет всем 👋! Я @${botUsername}. 
        
        Я буду вас уведомлять о всех наших мероприятиях (daily scrum), так что гладим меня по голове 🐯 
        
        Поздоровайтесь со мной набрав /hello чтобы я смог с вами работать.

        Советую вам создать себе какой нибудь @username чтобы я мог с вами хорошо работать`,
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * When new user is added to group
 * @param users
 * @returns {string}
 */
const welcome = (users) => {
    let commaUsers = users.map((user) => {
        return (user.username) ? `@${user.username}` : user.first_name;
    }).join(',');

    let variants = [
        `Привет ${commaUsers}. Добро пожаловать в нашу группу`,

    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * After user sent /hello
 * @param user
 * @returns {string}
 */
const hello = (user) => {
    let name = (user.username) ? `@${user.username}` : user.first_name;
    let variants = [
        `Здравствуйте ${name}`,
        `Привет ${name} 😸`,
        `Здарова ${name}`,
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};


/**
 * This is used to describe that kind command does not exists
 * @param command
 * @returns {string}
 */
const unknownCommand = (command) => {
    let variants = [
        `Неизвестная команда ${command}`,
        `Неплохая идея`,
        `Такой команды ${command} я не знаю`,
        `Нет у меня такой команды`,
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

const askProvideProjectName = () => {
    return `Название проекта?\nОтветьте(Reply) на это сообщение названием проекта.`;
};

const askProvideBugShortDescription = () => {
    return `Ответьте на это сообщение(Reply)!\n\nВ ответе введите короткое описание бага. Подробное описание и картинки можно будет добавить позже.`;
};

let getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};

const showBugInfo = (bug) => {
    return `Баг #${bug.id}
Name: ${bug.short_description}
Status: ${getKeyByValue(BugStatusEnum, bug.status)}
Reported: @${bug.reporter}
Opened date: ${dateFormat(bug.create_date, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}

Ответьте(Reply) на это сообщение чтобы добавить комментарий.`;
};

const promptAuthPassword = (passwordHint) => {
  return `Для общения с этим ботом требуется ввести пароль.\nПодсказка: ${passwordHint}\nОтветьте(Reply) на это сообщение паролем от данного бота.`;
};

module.exports.greetings = greetings;
module.exports.welcome = welcome;
module.exports.hello = hello;
module.exports.unknownCommand = unknownCommand;
module.exports.askProvideProjectName = askProvideProjectName;
module.exports.askProvideBugShortDescription = askProvideBugShortDescription;
module.exports.showBugInfo = showBugInfo;
module.exports.promptAuthPassword = promptAuthPassword;