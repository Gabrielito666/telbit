/**
 * @class
 */
class User
{
    /**
     * 
     * @param {import("../types/index").TelbitUserContructorParams} param0 
     */
    constructor({bot, id, username, first_name, last_name})
    {
        this.bot = bot;
        this.id = id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;

        bot.users[id] = this;
    }
}

module.exports = User;