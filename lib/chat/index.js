const Message = require("../message");
const User = require("../user");

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
        this.listeners.emitter.on(`chat-${this.id}-msg`, callback);
        return this;
    }

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
    async ban(user)
    {
        
    }
    async unban(user)
    {

    }
    async kick(user)
    {

    }
    async permisions(options)
    {
        
    }
}
module.exports = Chat;