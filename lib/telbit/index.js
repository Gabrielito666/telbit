const apiMethods = require("../api-methods");

const Chat = require("../chat");
const Message = require("../message");
const User = require("../user");
const Permissions = require("../permissions");

/**
 * @typedef {import("../types/index").telbitCallback} telbitCallback
*/

/**
 * @class
 */
class Telbit
{
    /**
     * 
     * @param {string} BOT_TOKEN 
     */
    constructor(BOT_TOKEN)
    {

        this.chats = {};
        this.users = {};

        this.methods = apiMethods(BOT_TOKEN);
        
        this.listeners = this.methods.listeners();
        this.me = this.methods.getMe().then(meRes => new User({bot: this, ...meRes }));

        this.listeners.start();
        //setear un stopeador cuando se acabe el proceso;

        this.listeners.emitter.on("update", (update) =>
        {
            if(update?.message)
            {
                const chat = this.chats[update.message.chat.id] || new Chat({bot: this, id: update.message.chat.id});

                if(update.message.left_chat_member)
                {
                    const user =
                    this.users[update.message.left_chat_member.id] || new User({bot: this, ...update.message.left_chat_member});

                    const msg = new Message({
                        bot: this,
                        id: update.message.message_id,
                        chat,
                        text: update.message.text,
                        user,
                        date: update.message.date
                    });
                    //general left listener
                    this.listeners.emitter.emit("left_chat_member", msg, chat, user);
                    //chat left listener
                    this.listeners.emitter.emit(`chat-${chat.id}-left_chat_member`, msg, chat, user);
                }
                else if(update.message.new_chat_members)
                {
                    const user =
                    this.users[update.message.new_chat_member.id] || new User({bot: this, ...update.message.new_chat_member});

                    const msg = new Message({
                        bot: this,
                        id: update.message.message_id,
                        chat,
                        text: update.message.text,
                        user,
                        date: update.message.date
                    });
                    //general new chat member
                    this.listeners.emitter.emit("new_chat_member", msg, chat, user);
                    //chat new chat member
                    this.listeners.emitter.emit(`chat-${chat.id}-new_chat_member`, msg, chat, user);
                }
                else
                {
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
            }
        });
    }
    /**
     * 
     * @param {number} chat_id 
     * @returns {Chat}
     */
    chat(chat_id)
    {
        return new Chat({ bot: this, id: chat_id });
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Telbit}
     */
    onMessage(callback)
    {
        this.listeners.emitter.on("message", callback);
        return this;
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Telbit}
     */
    onNewChatMember(callback)
    {
        this.listeners.emitter.on("new_chat_member", callback);
        return this;
    }
    /**
     * @param {telbitCallback} callback
     * @returns {Telbit}
     */
    onLeftChatMember(callback)
    {
        this.listeners.emitter.on("left_chat_member", callback);
        return this;
    }
    /**
     * 
     * @param {(error:Error) => void} callback 
     * @returns {Telbit}
     */
    onError(callback)
    {
        this.listeners.emitter.on("error", callback);
        return this;
    }
    /**
     * 
     * @param {boolean} initBoolean
     * @returns {Permissions}
     */
    permissionsFactory(initBoolean=true)
    {
        return new Permissions(initBoolean);
    }
}

module.exports = Telbit;