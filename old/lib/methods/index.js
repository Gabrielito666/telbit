/**
 * @param {import("telegraf").Telegraf} telegrafBot
 * @param {number|string} chat_id
 * @param {string} text
 * @param {object} extra
*/
const sendMessage = (telegrafBot, chat_id, text, extra) => telegrafBot.telegram.sendMessage(chat_id, text, extra);
/**
 * @param {import("telegraf").Telegraf} telegrafBot
 * @param {number|string} chat_id
 * @param {number|string} message_id
*/
const deleteMessage = (telegrafBot, chat_id, message_id) => telegrafBot.telegram.deleteMessage(chat_id, message_id);
/**
 * @param {import("telegraf").Telegraf} telegrafBot
 * @param {number|string} chat_id
 * @param {number|string} message_id
 * @param {string} text
 * @param {object} extra
*/
const editMessage = (telegrafBot, chat_id, message_id, text) => telegrafBot.telegram.editMessageText(chat_id, message_id, text, extra);

module.exports = { sendMessage, deleteMessage, editMessage }