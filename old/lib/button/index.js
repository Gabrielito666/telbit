const crypto = require('crypto');
const {Markup} = require("telegraf");
const TYPES_SYMBOLS = require('../types-symbols');

class Button
{
    /**
     * @param {string} text
     * @param {function} onClick
     * @param {import("../telbit-bot/index")} bot
     */
    constructor(text, onClick = () => {}, options={}, bot)
    {
        this._text = text;
        this._onClick = onClick;
        this._bot = bot;
        this._available = true;
        this._time_of_callback_life = options.time_of_callback_life || 1000 * 60 * 60 * 24;

        this.__type_symbol__ = TYPES_SYMBOLS.BUTTON;

        this._button_handlers = new Map();
        this._button_callback_id = crypto.randomBytes(16).toString('hex');
        this._button_handlers.set(this._button_callback_id, onClick);

        setTimeout(() => //En el futuro podemos lanzar esto desde que se envia el msg en lugar de desde cuando se crea el button
        {
            this._button_handlers.delete(this._button_callback_id);
            this._available = false;
        }, this._time_of_callback_life);

        this._bot._telegraf_bot.on('callback_query', async (ctx, next) =>
        {
            const data = ctx.callbackQuery.data;
            const handler = this._button_handlers.get(data);
            
            if (handler && typeof handler === "function" && this._available)
            {
                await handler(ctx);
            }

            next();
        });

        this._payload = Markup.inlineKeyboard([Markup.button.callback(text, this._button_callback_id)]);
        this._reply_markup = this._payload.reply_markup;
    }

    get payload()
    {
        return this._payload;
    }
    get reply_markup()
    {
        return this._reply_markup;
    }
    get text()
    {
        return this._text;
    }
    set text(newText)
    {
        this._text = newText;
        this._payload = Markup.inlineKeyboard([Markup.button.callback(newText, this._button_callback_id)]);
        this._reply_markup = this._payload.reply_markup;
    }
    get onClick()
    {
        return this._onClick;
    }
    set onClick(newOnClick)
    {
        this._onClick = newOnClick;
        this._button_handlers.set(this._button_callback_id, newOnClick);
    }
    get available()
    {
        return this._available;
    }
}

module.exports = Button;