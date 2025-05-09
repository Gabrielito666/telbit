const { Telegraf } = require("telegraf");
const Events = require('events');

const Message = require("../message");
const Chat = require("../chat");
const Button = require("../button");
const User = require("../user");
const TYPES_SYMBOLS = require("../types-symbols");

class Telbit
{
    /**
     * 
     * @param {*} telegramBot_apiKey 
     * @param {import("telegraf").Telegraf.LaunchOptions} launchOptions
     */
    constructor(telegramBot_apiKey, launchOptions)
    {
        this._telegraf_bot = new Telegraf(telegramBot_apiKey);
        this._emitter = new Events();

        this.__type_symbol__ = TYPES_SYMBOLS.TELBIT_BOT;

        this._chats = {};

        this._telegraf_bot.on("message", (ctx, next) =>
        {
            const chat = this._chats[ctx.chat.id] || new Chat(ctx.chat.id, this);

            if (ctx.message.left_chat_member) {
                ctx.message.left_chat_member
                
                const user = new User(ctx.message.left_chat_member.id, ctx.message.left_chat_member, this);

                this._emitter.emit("userLeft", user, chat);
            }
            else if (ctx.message.new_chat_members)
            {
                ctx.message.new_chat_members.forEach((newMember) =>
                {
                    const user = new User(newMember.id, newMember, this);
                    this._emitter.emit("userJoined", user, chat);
                })
            }
            else
            {
                const message = new Message(ctx.text, {}, this);
                message._message_id = ctx.message.message_id;
                message._is_send = true;
    
                message._destination_chat = chat;
    
                const user = new User(ctx.from.id, ctx.from, this);
    
                this._emitter.emit("message", message, user, chat);    
            }
            next();
        });

        this._telegraf_bot.launch(launchOptions);
        process.once('SIGINT', () => this._telegraf_bot.stop('SIGINT'));
        process.once('SIGTERM', () => this._telegraf_bot.stop('SIGTERM'));
    }
    get Chat()
    {
        const __THIS__REFERENCE__ = this;
        return class extends Chat
        {
            /**
             * @param {number|string}
            */
            constructor(chat_id)
            {
                super(chat_id, __THIS__REFERENCE__);
            }
        }
    }
    get Message()
    {
        const __THIS__REFERENCE__ = this;
        return class extends Message
        {
            /**
             * @param {string} text
             * @param {object} options
             * @param {number} options.duration
             * @param {import("../button/index")[]} options.buttons
             * 
             */
            constructor(text, options={})
            {
                super(text, options, __THIS__REFERENCE__);
            }
        }
    }
    get Button()
    {
        const __THIS__REFERENCE__ = this;
        return class extends Button
        {
            constructor(text, onClick = () => {}, options={})
            {
                super(text, onClick, options, __THIS__REFERENCE__);
            }
        }
    }
    get User()
    {
        const __THIS__REFERENCE__ = this;
        return class extends User
        {
            /**
             * @param {number|string}
             * @param {import("telegraf/types").User}
             * */
            constructor(user_id, info)
            {
                super(user_id, info, __THIS__REFERENCE__);
            }
        }
    }

    /**
     * @param {(message: import("../message/index"), user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {void}
     */
    onMessage(callback)
    {
        this._emitter.on("message", callback);
    }
    /**
     * @param {(user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {void}
     */
    onNewChatMember(callback)
    {
        this._emitter.on("userJoined", callback);
    }
    /**
     * @param {(user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {void}
     */
    onLeftChatMember(callback)
    {
        this._emitter.on("userLeft", callback);
    }
    /**
     * @param {(error:Error)=>void} callback
     */
    onError(callback)
    {
        this._emitter.on("error", callback);
        return this;
    }
    /**
     * 
     * @param {Chat|User} chatOrUser 
     * @param {Message} message 
     * @returns 
     */
    send(chatOrUser, message)
    {
        const id = chatOrUser.id;
        this._telegraf_bot.telegram.sendMessage(id, message.text, message.extra)
        .then((response) =>
        {
            message._is_send = true;
            message._message_id = response.message_id;
        }).catch((error) =>
        {
            this._emitter.emit("error", error);
            this._emitter.emit("error", error);
        });
        return this;
    }
    /**
     * 
     * @param {Chat} chat 
     * @param {Message} message 
     * @returns 
     */
    delete(chat, message)
    {
        if(!message._is_send)
        {
            this._emitter.emit("error", new Error("No se puede eliminar un mensaje que no ha sido enviado"));
        }
        else if(message._is_delete)
        {
            this._emitter.emit("error", new Error("No se puede eliminar un mensaje que ya ha sido borrado"));
        }
        else
        {
            this._telegraf_bot.telegram.deleteMessage(chat.id, message.id)
            .then(() =>
            {
                message._is_delete = true;
            })
            .catch((error) =>
            {
                this._emitter.emit("error", error);
                this._emitter.emit("error", error);
            });
        }
        return this;
    }
}

module.exports = Telbit;