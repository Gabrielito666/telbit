const apiMethods = require("../api-methods");

const Chat = require("../chat");
const Message = require("../message");
const User = require("../user");
/**
 * @typedef {import("../message")} Message
 * @typedef {import("../chat")} Chat
 * @typedef {import("../user")} User
*/

class Telbit
{
    constructor(BOT_TOKEN)
    {

        this.chats = {};
        this.users = {};

        this.methods = apiMethods(BOT_TOKEN);
        
        this.listeners = this.methods.listeners();
        this.me = this.methods.getMe().then(meRes => new User({bot: this, ...meRes}));

        this.listeners.start();
        //setear un stopeador cuando se acabe el proceso;

        this.listeners.emitter.on("update", (update={}) =>
        {
            if(update.message)
            {
                const chat = this.chats[update.message.chat.id] || new Chat({bot: this, id: update.message.chat.id});
                const user = this.users[update.message.from.id] || new User({bot: this, ...update.message.from});

                const msg = new Message({
                    bot: this,
                    id: update.message.message_id,
                    chat,
                    text: update.message.text,
                    user,
                    date: update.message.date
                });

                //general msg
                this.listeners.emitter.emit("message", msg, chat, user);
                //chat msg
                this.listeners.emitter.emit(`chat-${chat.id}-msg`, msg, chat, user);
            }
        });
    }
    async chat(chat_id)
    {
        return new Chat({ bot: this, id: chat_id });
    }
    /**
     * @param {(message:Message, chat:Chat, user:User) => Telbit} callback
     */
    onMessage(callback)
    {
        this.listeners.emitter.on("message", callback);
        return this;
    }
}


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