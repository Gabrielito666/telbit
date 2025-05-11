const Message = require("../message");
const User = require("../user");

/**
 * @typedef {object} permissions
 * @property {boolean} permissions.can_send_messages
 * @property {boolean} permissions.can_send_media_messages
 * @property {boolean} permissions.can_send_polls
 * @property {boolean} permissions.can_send_other_messages
 * @property {boolean} permissions.can_add_web_page_previews
 * @property {boolean} permissions.can_change_info
 * @property {boolean} permissions.can_invite_users
 * @property {boolean} permissions.can_pin_messages
*/

class Chat
{
    constructor({bot, id})
    {
        this.bot = bot;
        this.id = id;

        this.bot.chats[id] = this;
    }
    /**
     * @param {(message:Message, chat:Chat, user:User) => Telbit} callback
    */
    onMessage(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-msg`, callback);
        return this;
    }
    /**
     * @param {(message:Message, chat:Chat, user:User) => Telbit} callback
    */
    onNewChatMember(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-new_chat_member`, callback);
    }
    /**
     * @param {(message:Message, chat:Chat, user:User) => Telbit} callback
    */
    onLeftChatMember(callback)
    {
        this.bot.listeners.emitter.on(`chat-${this.id}-left_chat_member`, callback);
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
     * @param {user} user 
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
     * @param {permissions} permissions 
     * @param {number|undefined} duration milliseconds 
     * @returns {Promise<Chat>}
     */
    async restrictUser(user, permissions)
    {
        await this.bot.methods.restrictUser(this.id, user.id, permissions);
        return this;
    }
    /**
     * 
     * @param {permissions} permissions 
     * @return {Promise<Chat>}
     */
    async restrictAllChatUsers(permissions)
    {
        await this.bot.methods.restrictChat(this.id, permissions);
        return this;
    }
}
module.exports = Chat;