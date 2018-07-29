/**
 * This file contains all possible replies of bot
 */

let dateFormat = require('dateformat');
const BugStatusEnum = require('./db').BugStatusEnum;

const negativeResultMessages = (user) => {
    return [
        `Почему нет @${user.username}? Напиши причину и что ты сделал по предыдущим задачам, и что ты должен делать сегодня, ответив на это сообщение.`,
        `Не придешь? @${user.username} почему и что ты успел сделать по задачам и что ты должен сегодня сделать? Ответь на это сообщение. Напиши причину`,
    ];
}


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

/**
 * Sometimes scrum could be deleted.
 * @param user
 * @returns {string}
 */
const scrumNotfound = (user) => {
    let variants = [
        `@${user.username} Я что то не помню, что задавал такой вопрос`,
        `Кажется кто то удалил этот вопрос из моей базы @${user.username}`,

    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * When user is answering already answered scrum
 * @param user
 * @returns {string}
 */
const scrumAlreadyAnswered = (user) => {
    let variants = [
        `На этот скрам ты уже ответил @${user.username}`,
        `@${user.username} Этот скрам уже имеет ваш ответ`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * When user is trying to answer to scrum that does not belong to him
 * @param user
 * @returns {string}
 */
const youCannotAnswerToThatScrum = (user) => {
    let variants = [
        `@${user.username}, Этот вопрос не для вас`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * This text will be sent to user when user answers to scrum positively
 * @param user
 * @returns {string}
 */
const positiveAnswerResult = (user) => {
    let variants = [
        `Отлично ☺! Будем ждать тебя @${user.username}`,
        `Это хорошо @${user.username}`,
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * These variants will be asked if user answers negatively
 * @param user
 * @returns {string}
 */
const askReasonForNegativeResult = (user) => {
    return negativeResultMessages(user)[Math.floor(Math.random() * negativeResultMessages(user).length)];
};

/**
 * Whether passed {msg} is negative result question for {user}.
 * @param user
 * @returns {boolean}
 */
const isNegativeResultMessage = (msg, user) => {
    return negativeResultMessages(user).indexOf(msg) > -1;
};

/**
 * This is reasking texts
 * @param users
 * @returns {string}
 */
const askReasonForNegativeResultAgain = (users) => {
    let commaUsers = users.map((user) => {
        return (user.username) ? `@${user.username}` : user.first_name;
    }).join(',');

    let variants = [
        `${commaUsers} Вы все еще не написали причину что не придете. Напишите его ответив на это сообщение. Ну еще по задачам скрама не забывайте`,
        `Я все еще жду причины почему вы не придете ${commaUsers}. Ответьте на это сообщение. Еще по скраму напишите что сделали а что нет`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * This text will be written when user writes reason of rejection
 * @param user
 * @returns {string}
 */
const reasonAccepted = (user) => {
    let variants = [
        `Хорошо @${user.username}, понятно`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * When user answers to scrum that already expired
 * @param user
 * @returns {string}
 */
const questionIsOutOfTime = (user) => {
    let variants = [
        `Этот вопрос уже просрочен @${user.username}`,
        `На этот вопрос уже не надо отвечать @${user.username}`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * Captain Obvious.
 * @param user
 * @returns {string}
 */
const questionNotForThisUser = (user) => {
    let variants = [
        `Этот вопрос не для тебя @${user.username}!`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * Captain Obvious
 * @param users
 * @returns {string}
 */
const askUsersForScrum = (users) => {
    let commaUsers = users.map((user) => {
        return (user.username) ? `@${user.username}` : user.first_name;
    }).join(',');

    let variants = [
        `Сегодня у нас скрам ${commaUsers}, вы придете?`,
        `Вы сегодня на скрам придете? ${commaUsers}?`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * Captain Obvious
 * @param users
 * @returns {string}
 */
const askUsersForScrumAgain = (users) => {
    let commaUsers = users.map((user) => {
        return (user.username) ? `@${user.username}` : user.first_name;
    }).join(',');

    let variants = [
        `Вы не ответили на вопрос ${commaUsers}. Вы придете сегодня на скрам?`,
        `Я все еще жду ответа ${commaUsers}. Придете сегодня на скрам?`,
        `Народ! Особенно вот эти ${commaUsers}. Скрам?`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * Well.. Congratulations that you have been reading all these obvious docs
 * that are written just for sake of writing docs
 * @returns {string}
 */
const noScrumYet = () => {
    let variants = [
        `Сегодня я еще не спрашивал насчет скрама`,
        `Не помню что сегодня я спрашивал народ о скраме`,
        `Пока не спрашивал сегодня. Нужно подождать`
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

module.exports.greetings = greetings;
module.exports.welcome = welcome;
module.exports.hello = hello;
module.exports.unknownCommand = unknownCommand;
module.exports.scrumNotfound = scrumNotfound;
module.exports.scrumAlreadyAnswered = scrumAlreadyAnswered;
module.exports.youCannotAnswerToThatScrum = youCannotAnswerToThatScrum;
module.exports.positiveAnswerResult = positiveAnswerResult;
module.exports.askReasonForNegativeResult = askReasonForNegativeResult;
module.exports.isNegativeResultMessage = isNegativeResultMessage;
module.exports.reasonAccepted = reasonAccepted;
module.exports.questionIsOutOfTime = questionIsOutOfTime;
module.exports.questionNotForThisUser = questionNotForThisUser;
module.exports.askUsersForScrum = askUsersForScrum;
module.exports.askUsersForScrumAgain = askUsersForScrumAgain;
module.exports.askReasonForNegativeResultAgain = askReasonForNegativeResultAgain;
module.exports.noScrumYet = noScrumYet;
module.exports.askProvideProjectName = askProvideProjectName;
module.exports.askProvideBugShortDescription = askProvideBugShortDescription;
module.exports.showBugInfo = showBugInfo;
