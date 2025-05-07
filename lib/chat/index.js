const Events = require("events");
const User = require('../user');
const TYPES_SYMBOLS = require("../types-symbols");

class Chat
{
    /**
     * 
     * @param {number|string} chat_id 
     * @param {import("../telbit-bot/index")} bot 
     */
    constructor(chat_id, bot)
    {
        this._bot = bot;
        this._bot._chats[chat_id] = this;
        this._chat_id = chat_id;
        this._emitter = new Events();
        this.__type_symbol__ = TYPES_SYMBOLS.CHAT;

        this._bot.onMessage((message, user, chat) =>
        {
            if (chat === this || chat._chat_id === this._chat_id)
            {
                this._emitter.emit("message", message, user, chat);
            }
        })
        this._bot.onNewChatMember((user, chat) =>
        {
            if (chat === this || chat._chat_id === this._chat_id)
            {
                this._emitter.emit("userJoined", user, chat);
            }
        })

        this._bot.onLeftChatMember((user, chat) =>
        {
            if (chat === this || chat._chat_id === this._chat_id)
            {
                this._emitter.emit("userLeft", user, chat);
            }
        })
    }
    async send(msg, options={})
    {
        if (typeof msg !== "object" || msg.__type_symbol__ !== TYPES_SYMBOLS.MESSAGE)
        {
            msg = new this._bot.Message(msg, options);
        };
    
        await this._bot._telegraf_bot.telegram.sendMessage(this._chat_id, msg.text, {
            reply_markup: {
                inline_keyboard: msg._buttons.map(btn => btn.reply_markup.inline_keyboard[0])
            },
            parse_mode: "HTML"
        }).then((response) =>
        {
            msg._is_send = true;
            msg._message_id = response.message_id;
        }).catch((error) =>
        {
            console.error("Error sending message:", error);
        });
        this;
    }
    /**
     * @param {(message: import("../message/index"), user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {void}
     */
    onMessage(callback)
    {
        this._emitter.on("message", callback);
    }
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
    mute(user)
    {
        if (user instanceof User)
        {
            user.mute(this);
        }
    }
    unmute(user)
    {
        if (user instanceof User)
        {
            user.unmute(this);
        }
    }
    kick(user)
    {
        if (user instanceof User)
        {
            user.kick(this);
        }
    }
    ban(user)
    {
        if (user instanceof User)
        {
            user.ban(this);
        }
    }
    unban(user)
    {
        if (user instanceof User)
        {
            user.unban(this);
        }
    }
    
}
module.exports = Chat;