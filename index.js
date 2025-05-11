const Telbit = require("./lib/telbit");

/**
 * 
 * @param {string} BOT_TOKEN 
 * @returns {import("./lib/types/index")}
 */
const telbit = (BOT_TOKEN) =>
{
    try
    {
        return new Telbit(BOT_TOKEN);
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = telbit;