
/**
 * @class
 */
class Message
{
    /**
     * 
     * @param {import("../types/index").TelbitMessageConstructorParams} param0 
     */
    constructor({bot, id, chat, text, user, date})
    {
        this.bot = bot;
        this.text = text;
        this.chat = chat;
        this.id = id;
        this.user = user;
        this.date = date;
    }
    async delete()
    {
        await this.bot.methods.deleteMessage(this.chat.id, this.id);
    }
    /**
     * 
     * @param {string} newText 
     */
    async edit(newText)
    {
        await this.bot.methods.editMessage(this.chat.id, this.id, newText);
        this.text = newText;
    }
}
module.exports = Message;