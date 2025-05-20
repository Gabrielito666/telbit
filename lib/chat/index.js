const Message = require("../message");
const User = require("../user");

/**
 * @typedef {import("../telbit")} Telbit
 * @typedef {import("../permissions")} Permissions
 * @typedef {import("../types/index").telbitCallback} telbitCallback
 */

/**
 * @class
 */
class Chat
{
    /**
     * 
     * @param {import("../types/index").TelbitChatConstructorParams} param0 
     */
    constructor({bot, id})
    {
        this.bot = bot;
        this.id = id;
        this.bot.chats[id] = this;
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Chat}
    */
    onMessage(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-msg`, callback);
        return this;
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Chat}
    */
    onNewChatMember(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-new_chat_member`, callback);
        return this;
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Chat}
    */
    onLeftChatMember(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-left_chat_member`, callback);
        return this;
    }
    /**
     * 
     * @param {string} text 
     * @returns {Promise<Message>}
     */
    async message(text)
    {
        const msgRes = await this.bot.methods.sendMessage(this.id, text);

        return new Message({
            bot: this.bot,
            id: msgRes.message_id,
            chat: this,
            text: msgRes.text,
            user: this.bot.users[msgRes.from.id] || new User({bot: this.bot, ...msgRes.from}),
            date : msgRes.date
        });
    }
    /**
     * 
     * @param {User} user 
     * @returns {Promise<Chat>}
     */
    async ban(user)
    {
        await this.bot.methods.banUser(this.id, user.id);
        return this;
    }
    /**
     * 
     * @param {User} user 
     * @returns {Promise<Chat>}
     */
    async unban(user)
    {
        await this.bot.methods.unbanUser(this.id, user.id);
        return this;
    }
    /**
     * 
     * @param {User} user 
     * @returns {Promise<Chat>}
     */
    async kick(user)
    {
        await this.bot.methods.kickUser(this.id, user.id);
        return this;
    }
    /**
     * 
     * @param {User} user 
     * @param {Permissions} permissions 
     * @returns {Promise<Chat>}
     */
    async restrictUser(user, permissions)
    {
        await this.bot.methods.restrictUser(this.id, user.id, permissions);
        return this;
    }
    /**
     * 
     * @param {Permissions} permissions 
     * @return {Promise<Chat>}
     */
    async restrictAllChatUsers(permissions)
    {
        await this.bot.methods.restrictChat(this.id, permissions);
        return this;
    }
}
module.exports = Chat;