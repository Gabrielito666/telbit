/**
 * @typedef {Object} Permissions
 * @property {boolean} can_send_messages
 * @property {boolean} can_send_media_messages
 * @property {boolean} can_send_polls
 * @property {boolean} can_send_other_messages
 * @property {boolean} can_add_web_page_previews
 * @property {boolean} can_change_info
 * @property {boolean} can_invite_users
 * @property {boolean} can_pin_messages
*/

/**
 * @typedef {Object} Message
 * @property {Telbit} bot - Instancia del bot
 * @property {string} text - Contenido del mensaje
 * @property {Chat} chat - Objeto del chat
 * @property {number} id - ID del mensaje
 * @property {User} user - Usuario que envió el mensaje
 * @property {number} date - Timestamp UNIX del mensaje
 * @property {function(): Promise<void>} delete - Elimina el mensaje
 * @property {function(string): Promise<void>} edit - Edita el texto del mensaje
*/

/**
 * @typedef {Object} User
 * @property {Telbit} bot - Instancia del bot
 * @property {number} id - ID del usuario
 * @property {string} [username] - Nombre de usuario (opcional)
 * @property {string} [first_name] - Primer nombre (opcional)
 * @property {string} [last_name] - Apellido (opcional)
*/

/**
 * @typedef {Object} Chat
 * @property {Telbit} bot - Instancia del bot
 * @property {number} id - ID del chat
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => Chat} onMessage - Escucha mensajes entrantes
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => void} onNewChatMember - Escucha nuevos miembros
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => void} onLeftChatMember - Escucha salidas de miembros
 * @property {(text: string) => Promise<Message>} message - Envía un mensaje
 * @property {(user: User) => Promise<Chat>} ban - Banea a un usuario
 * @property {(user: User) => Promise<Chat>} unban - Desbanea a un usuario
 * @property {(user: User) => Promise<Chat>} kick - Expulsa a un usuario
 * @property {(user: User, permissions: Permissions) => Promise<Chat>} restrictUser - Restringe a un usuario
 * @property {(permissions: Permissions) => Promise<Chat>} restrictAllChatUsers - Restringe a todos los usuarios
*/

/**
 * @typedef {Object} Telbit
 * @property {Object<number, Chat>} chats - Diccionario de chats indexado por ID
 * @property {Object<number, User>} users - Diccionario de usuarios indexado por ID
 * @property {*} methods - Métodos de la API (No se recomienda usarlos)
 * @property {{ emitter: import("events").EventEmitter, start: () => void }} listeners - Manejador de eventos
 * @property {Promise<User>} me - Información del bot
 * @property {(chat_id: number) => Promise<Chat>} chat - Obtiene una instancia de Chat por ID
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => Telbit} onMessage - Callback general de mensajes
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => Telbit} onNewChatMember - Callback general de nuevos miembros
 * @property {(callback: (message: Message, chat: Chat, user: User) => Telbit) => Telbit} onLeftChatMember - Callback general de salidas de miembros
 * @property {(initBoolean?: boolean) => Permissions} permissionsFactory - Generador de permisos
 * @property {(callback: (error: Error) => void) => Telbit} onError - Callback general de errores
*/

const TelbitClass = require("./lib/telbit");

/**
 * 
 * @param {string} BOT_TOKEN 
 * @returns {Telbit}
 */
const telbit = (BOT_TOKEN) =>
{
    try
    {
        return new TelbitClass(BOT_TOKEN);
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = telbit;