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
    send(msg, options={})
    {
        if (typeof msg !== "object" || msg.__type_symbol__ !== TYPES_SYMBOLS.MESSAGE)
        {
            msg = new this._bot.Message(msg, options);
        };
    
        msg._destination_chat = this;
        return this._bot._telegraf_bot.telegram.sendMessage(this._chat_id, msg.text, {
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
            this._bot._emmiter("error", error);
        })
        .finally(() =>
        {
            if (msg._duration) setTimeout(msg.delete.bind(msg), msg._duration);
            return this;
        });
    }
    /**
     * @param {(message: import("../message/index"), user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {User}
    */
    onMessage(callback)
    {
        this._emitter.on("message", callback);
        return this;
    }
    /**
     * @param {(user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {Chat}
    */
    onNewChatMember(callback)
    {
        this._emitter.on("userJoined", callback);
        return this;
    }
    /**
     * @param {(user: import("../user/index"), chat: import("../chat/index")) => void} callback
     * @returns {Chat}
     */
    onLeftChatMember(callback)
    {
        this._emitter.on("userLeft", callback);
        return this;
    }
    mute(user)
    {
        if (user instanceof User)
        {
            user.mute(this);
        }
        return this;
    }
    unmute(user)
    {
        if (user instanceof User)
        {
            user.unmute(this);
        }
        return this;
    }
    kick(user)
    {
        if (user instanceof User)
        {
            user.kick(this);
        }
        return this;
    }
    ban(user)
    {
        if (user instanceof User)
        {
            user.ban(this);
        }
        return this;
    }
    unban(user)
    {
        if (user instanceof User)
        {
            user.unban(this);
        }
        return this;
    }

    muteAll()
    {
        this
        ._bot
        ._telegraf_bot
        .telegram
        .setChatPermissions(this._chat_id, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
            can_invite_users: false,
            can_pin_messages: false,
            can_send_audios: false,
            can_send_documents: false,
            can_send_photos: false,
            can_send_videos: false,
            can_send_video_notes: false,
            can_send_voice_notes: false
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error)
            return this;
        })
        .then(() =>
        {
            return this;
        });
    }
    unmuteAll()
    {
        this
        ._bot
        ._telegraf_bot
        .telegram
        .setChatPermissions(this._chat_id, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_invite_users: true,
            can_pin_messages: false,
            can_send_audios: true,
            can_send_documents: true,
            can_send_photos: true,
            can_send_videos: true,
            can_send_video_notes: true,
            can_send_voice_notes: true
        })
        .catch(error =>
        {
            this._bot._emmiter.emit("error", error);
            this._emitter.emit("error", error);
            return this;
        })
        .then(() =>
        {
            return this;
        });
    }
    /**
     * 
     * @param {(error:Error) => void} callback 
    */
    onError(callback)
    {
        this._emitter.on("error", callback);
        return this;
    }
}

module.exports = Chat;