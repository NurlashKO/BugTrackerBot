/**
 * This file describes all database schemas that are being used in this project
 */

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseRandom = require('mongoose-random');
const uniqueValidator = require('mongoose-unique-validator');

// Schemas
const UserSchema = mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    username: String,
    is_active: Boolean,
    chat_id: Number,
    selected_project: {
        type: String,
        default: '',
    },
});
UserSchema.plugin(mongooseRandom);

const ChatSchema = mongoose.Schema({
    id: Number,
    title: String
});


const ProjectSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true,
    },
});
ProjectSchema.plugin(uniqueValidator);

let BugStatusEnum = Object.freeze({
    '🔷 OPEN': 1,
    '✅ DONE': 3,
    '❌ DELETE': 2,
});
const BugSchema = mongoose.Schema({
    reporter: String,
    project: {
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    create_date: {type: Date, default: Date.now},
    comments: Array,
});
BugSchema.plugin(uniqueValidator);
BugSchema.plugin(AutoIncrement, {inc_field: 'id'});

let User = mongoose.model('User', UserSchema);
let Chat = mongoose.model('Chat', ChatSchema);
let Project = mongoose.model('Project', ProjectSchema);
let Bug = mongoose.model('Bug', BugSchema);

// Methods
const addOrActivateUser = async(telegramUser) => {
    try {
        let user = await User.findOne({id: telegramUser.id});

        if (!user) {
            user = new User({
                id: telegramUser.id,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                username: telegramUser.username,
                is_active: true,
                chat_id: 0
            });
        } else {
            user.is_active = true;
            user.username = telegramUser.username;
        }
        await user.save();
    } catch (err) {
        console.error(err);
    }
};
const disableUser = async(telegramUser) => {
    try {
        let user = await User.findOne({id: telegramUser.id});
        if (user) {
            user.is_active = false;
            await user.save()
        }
    } catch (err) {
        console.error(err);
    }
};
const createOrUpdateChat = async(chatId, chatTitle) => {
    try {
        let chat = await Chat.findOne({});

        if (!chat) {
            chat = new Chat({id: chatId, title: chatTitle});
        } else {
            chat.id = chatId;
            chat.title = chatTitle;
        }

        await chat.save();

    } catch (err) {
        console.error(err);
    }
};

const activatePersonalChat = async(telegramUser, chatId) => {
    try {
        let user = await User.findOne({id: telegramUser.id});
        if (!user) {
            user = new User({
                id: telegramUser.id,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                username: telegramUser.username,
                is_active: true,
                chat_id: chatId
            });
        } else {
            user.is_active = true;
            user.username = telegramUser.username;
            user.chat_id = chatId
        }
        await user.save();
    } catch (err) {
        console.error(err);
    }
};

const getUser = async(userId) => {
    try {
        return await User.findOne({id: userId});
    } catch (err) {
        console.error(err);
    }
};

const userSelectProject = async(userId, projectId) => {
    let user = await User.findOne({id: userId});
    let project = await Project.findOne({_id: projectId});
    if (user) {
        user.selected_project = project.name;
        await user.save();
    }
    return project.name;
};

const addProject = async(projectName) => {
    try {
        let project = await Project.findOne({name: projectName});

        if (!project) {
            project = new Project({
                name: projectName,
            });
        }
        await project.save();
    } catch (err) {
        console.error(err);
    }
};

const getUserProject = async(userId) => {
    let user = await User.findOne({id: userId});
    return user.selected_project;
};

const addBug = async(userId, short_description) => {
    try {
        let projectName = await getUserProject(userId);
        let user = await getUser(userId);
        bug = new Bug({
            short_description: short_description,
            project: projectName,
            reporter: user.username,
            comments: [],
            status: BugStatusEnum["🔷 OPEN"],
        });
        return await bug.save();
    } catch (err) {
        console.error(err);
    }
};

const addBugComment = async(bugId, comment) => {
    try {
        let bug = await getBug(bugId);
        bug.comments.push(comment);
        return await bug.save();
    } catch(err) {
        console.error(err);
    }

};

const updateBugStatus = async(bugId, status) => {
    let bug = await getBug(bugId);
    bug.status = status;
    await bug.save();
};

/**
 * Return bug by specified bugId.
 * @param bugId
 * @returns {Promise<void>}
 */
const getBug = async(bugId) => {
    try {
       return await Bug.findOne({id: bugId});
    } catch (err) {
        console.error(err);
    }
};

/**
 * Call 'callback' with inline keyboard with all open bugs.
 */
const getOpenBugList = async (msg, callback) => {
    let projectName = await getUserProject(msg.from.id);
    Bug.find({project: projectName}).then(function(bugs) {
        let options = {
            reply_markup: {
                inline_keyboard: bugs.filter(bug => bug.status !== 2).map(value => [
                    {
                        'text': Object.keys(BugStatusEnum).find(key => BugStatusEnum[key] === value.status).split(' ')[0] + ' ' + value.short_description,
                        'callback_data': JSON.stringify({
                            sender: 'bug_show',
                            answer: value.id,
                        })
                    }])
            }
        };
        callback(msg.chat.id, `Лист багов для проекта: ${projectName}`, options);
    });
};


const getBugStatusOptions = (bug) => {
    return {
        reply_markup: {
            inline_keyboard: [
                    Object.entries(BugStatusEnum).filter(status => bug.status !== status[1]).map((status) => {return {
                        'text': status[0],
                        'callback_data': JSON.stringify({
                            sender: 'bug_change_status',
                            answer: {status: status[1], id: bug.id},
                        })
                    }})
            ]
        }
    }
};

/**
 * Inline keyboard with all registered projects.
 * @returns {{reply_markup: {inline_keyboard: [*]}}}
 */
const selectProjectOptions = (msg, callback) => {
    Project.find({}).then(function(data) {
        let projects = data.reduce(function(result, value, index, array) {
            if (index % 2 === 0)
                result.push(array.slice(index, index + 2));
            return result;
        }, []);
        let options = {
            reply_markup: {
                inline_keyboard: projects.map(value =>
                    value.map(value => {
                        return {
                            'text': value.name,
                            'callback_data': JSON.stringify({
                                sender: 'projects',
                                answer: value._id,
                            })
                        }
                    })
                )
            }
        };
        callback(msg.chat.id, 'Выберите один из проектов ниже.', options);
    })
};


module.exports.User = User;
module.exports.Chat = Chat;
module.exports.Bug = Bug;
module.exports.BugStatusEnum = BugStatusEnum;
module.exports.addOrActivateUser = addOrActivateUser;
module.exports.disableUser = disableUser;
module.exports.createOrUpdateChat = createOrUpdateChat;
module.exports.activatePersonalChat = activatePersonalChat;
module.exports.addProject = addProject;
module.exports.addBug = addBug;
module.exports.getBug = getBug;
module.exports.addBugComment = addBugComment;
module.exports.updateBugStatus = updateBugStatus;
module.exports.getOpenBugList = getOpenBugList;
module.exports.getUserProject = getUserProject;
module.exports.selectProjectOptions = selectProjectOptions;
module.exports.getBugStatusOptions = getBugStatusOptions;
module.exports.userSelectProject = userSelectProject;