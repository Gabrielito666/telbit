const Telbit = require("./lib/telbit");

/**
 * 
 * @param {string} BOT_TOKEN 
 * @returns {Telbit}
 */
const telbit = (BOT_TOKEN) => new Telbit(BOT_TOKEN);

module.exports = telbit;