/**
 * These are development settings. You should write your own bots token and its username
 * @type {{token: string, botName: string}}
 */
const prod_settings = {
	// put here your bot's token, example: `token: 591967441:NURLASHKOdpMpsHge05Z3Mvx0RWtmxQHx_GY`
    token: process.env.BOT_TOKEN,
    botUserName: 'codebusters_tester_nurlashko_bot',
};

module.exports.settings = prod_settings;