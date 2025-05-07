const Button = require("../button");
const TYPES_SYMBOLS = require("../types-symbols");

class Message
{
    /**
     * @param {string} text
     * @param {object} options
     * @param {number} options.duration
     * @param {import("../button/index")[]} options.buttons
     * @param {import("../telbit-bot/index")} bot
     */
    constructor(text, options={}, bot)
    {
        this._bot = bot;
        this._text = text;
        this._buttons = options.buttons || [];
        this._message_id = undefined;
        this.__type_symbol__ = TYPES_SYMBOLS.MESSAGE;

        this._is_send = false;
        this._is_edit = false;
        this._is_delete = false;

        this._is_editable = true;

        this._destination_chat = null;

        this._duration = options.duration || null;
    }
    
    get text()
    {
        return this._text;
    }
    set text(newText)
    {
        if (this._is_delete)
        {
            console.warn("Cannot edit a deleted message.");
        }
        else if(this._is_send)
        {
            this.edit(newText);
        }
        this._text = newText;
    }

    async sendTo(chat)
    {
        if(!this._is_send)
        {
            if(typeof chat === "object" && chat.__type_symbol__ === TYPES_SYMBOLS.CHAT)
            {
                this._destination_chat = chat;
                await this._destination_chat.send(this);
            }
            else
            {
                this._destination_chat = new this._bot.Chat(chat);
                await this._destination_chat.send(this);
            }
            this._is_send = true;
            
            if (this._duration) setTimeout(this.delete.bind(this), this._duration);
        }
        else
        {
            console.warn("Message already sent.");
        }
        return this;
    }
    edit(newMessage)
    {
        if (this._is_send && !this._is_delete && this._is_editable)
        {
            this._bot._telegraf_bot.telegram.editMessageText(this._destination_chat._chat_id, this._message_id, newMessage);
            this._is_edit = true;
        }
        else
        {
            console.warn("Cannot edit a message that has not been sent, has been deleted or are not your message.");
        }
    }
    delete()
    {
        if (this._is_send && !this._is_delete)
        {
            this._is_delete = true;
            this._bot._telegraf_bot.telegram.deleteMessage(this._destination_chat._chat_id, this._message_id);
        }
        else
        {
            console.warn("Cannot delete a message that has not been sent or has been deleted.");
        }
    }
    addButton(arg1, onClick = () => {}, options={})
    {
        if (arg1 instanceof Button)
        {
            this._buttons.push(arg1);
        }
        else if(typeof arg1 === "string" && typeof onClick === "function")
        {
            this._buttons.push(new Button(arg1, onClick, options, this._bot));
        }
        else
        {
            console.warn("Invalid arguments for button.");
        }
        return this;
    }
}
module.exports = Message;