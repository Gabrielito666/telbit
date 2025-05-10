const Events = require("events");
const TYPES_SYMBOLS = require('../types-symbols');
class User
{
    /**
     * @param {number|string} user_id
     * @param {import("telegraf/types").User} info
     * @param {import("../telbit-bot/index")} bot
     */
    constructor(user_id, info={}, bot)
    {
        this._bot = bot;
        this._user_id = user_id;
        this._username = info.username;
        this._first_name = info.first_name;
        this._last_name = info.last_name;
        this._is_bot = info.is_bot;

        this.__type_symbol__ = TYPES_SYMBOLS.USER;

        this._emitter = new Events();

        this._bot._emmiter.on("message", (message, user, chat) =>
        {
            if (user === this || user._user_id === this._user_id)
            {
                this._emitter.emit("message", message, user, chat);
            }
        });

        this._bot.onNewChatMember((user, chat) =>
        {
            if (user === this || user._user_id === this._user_id)
            {
                this._emitter.emit("userJoined", user, chat);
            }
        })

        this._bot.onLeftChatMember((user, chat) =>
        {
            if (user === this || user._user_id === this._user_id)
            {
                this._emitter.emit("userLeft", user, chat);
            }
        })
    }
    get id(){ return this._user_id }
    get user_id()
    {
        return this._user_id;
    }
    get username()
    {
        return this._username;
    }
    get first_name()
    {
        return this._first_name;
    }
    get last_name()
    {
        return this._last_name;
    }
    get is_bot()
    {
        return this._is_bot;
    }

    send(message, options={})
    {
        if (message !== "object" || message.__type_symbol__ !== TYPES_SYMBOLS.MESSAGE)
        {
            message = new this._bot.Message(message, options);
        };
    
        return this._bot._telegraf_bot.telegram.sendMessage(this._user_id, message.text, {
            reply_markup: {
                inline_keyboard: message._buttons.map(btn => btn.reply_markup.inline_keyboard[0])
            },
            parse_mode: "HTML"
        }).then((response) =>
        {
            message._is_send = true;
            message._message_id = response.message_id;
            return this;
        }).catch((error) =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        });
    }
    /**
     * mute a user in a chat
     * @param {import("../chat/index") | undefined | "string" | "number"} chat a Chat instance, undefined or a chat_id
     */
    mute(chat)
    {
        const chat_id = typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT ?
        chat._chat_id : chat;
        
        return this._bot._telegraf_bot.telegram.restrictChatMember(chat_id, this.user_id, {
            permissions: {
              can_send_messages: false,
              can_send_media_messages: false,
              can_send_polls: false,
              can_send_other_messages: false,
              can_add_web_page_previews: false,
              can_change_info: false,
              can_invite_users: false,
              can_pin_messages: false,
            },
        }).then(() =>
        {
            return this;
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this
        });
    }
    /**
     * unmute a user in a chat
     * @param {import("../chat/index") | "string" | "number"} chat a Chat instance or a chat_id
     */
    unmute(chat)
    {
        const chat_id = typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT ?
        chat._chat_id : chat;

        return this._bot._telegraf_bot.telegram.restrictChatMember(chat_id, this.user_id, {
            permissions: {
              can_send_messages: true,
              can_send_media_messages: true,
              can_send_polls: true,
              can_send_other_messages: true,
              can_add_web_page_previews: true,
              can_change_info: false,
              can_invite_users: true,
              can_pin_messages: false,
            },
        })
        .then(()=>
        {
            return this;
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        });
    }
    /**
     * kick a user in a chat
     * @param {import("../chat/index") | undefined | "string" | "number"} chat a Chat instance, undefined or a chat_id
     */
    kick(chat)
    {
        const chat_id = typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT ?
        chat._chat_id : chat;

        return this._bot._telegraf_bot.telegram.kickChatMember(chat_id, this.user_id)
        .then(()=>
        {
            return this;
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        });
        
    }
    /**
     * ban a user in a chat
     * @param {import("../chat/index") | undefined | "string" | "number"} chat a Chat instance, undefined or a chat_id
     */
    ban(chat)
    {
        const chat_id = typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT ?
        chat._chat_id : chat;

        return this._bot._telegraf_bot.telegram.banChatMember(chat_id, this.user_id)
        .then(()=>
        {
            return this;
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        });
    }
    /**
     * unban a user in a chat
     * @param {import("../chat/index") | undefined | "string" | "number"} chat a Chat instance, undefined or a chat_id
     */
    unban(chat)
    {
        const chat_id = typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT ?
        chat._chat_id : chat;

        return this._bot._telegraf_bot.telegram.unbanChatMember(chat_id, this.user_id)
        .then(()=>
        {
            return this;
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        });
    }
    /**
     * @param {(message: import("../message/index"), user: import("./index"), chat: import("../chat/index")) => void} callback
     * @returns {User}
     */
    onMessage(callback)
    {
        this._emitter.on("message", callback);
        return this
    }
    /**
     * @param {(user: import("./index"), chat: import("../chat/index")) => void} callback
     * @returns {User}
     */
    onNewChatMember(callback)
    {
        this._emitter.on("userJoined", callback);
        return this;
    }
    /**
     * @param {(user: import("./index"), chat: import("../chat/index")) => void} callback
     * @returns {User}
     */
    onLeftChatMember(callback)
    {
        this._emitter.on("userLeft", callback);
        return this;
    }
    /**
     * 
     * @param {(error: Error) => void} callback 
     */
    onError(callback)
    {
        this._emitter.on("error", callback);
        return this;
    }
}

module.exports = User;