# Telbit

**Telbit** es un *wrapper* de [Telegraf](https://telegraf.js.org/) para crear bots de Telegram con una interfaz más simple y directa.

> ⚠️ **Requiere Node.js versión 18**. No es compatible con versiones superiores debido a dependencias internas de Telegraf.

---

## Instalación

```bash
npm install telbit
```

---

## Uso básico

```js
const Telbit = require("telbit");
const bot = new Telbit("TOKEN_API_TELEGRAM");
```

Dentro de la instancia `bot` encontrarás las demás clases (`Chat`, `Message`, `User`, `Button`) y métodos utilitarios.

---

## Clases y métodos

### 🧠 Telbit

Clase principal para crear el bot.

#### Métodos disponibles

- `onMessage((message, chat, user) => {})`: ejecutado en cada mensaje recibido.
- `onNewChatMember((user, chat) => {})`: ejecutado cuando un usuario se une a un grupo.
- `onLeftChatMember((user, chat) => {})`: ejecutado cuando un usuario abandona un grupo.

---

### 💬 Chat

```js
const chat = new bot.Chat(chatId, options);
```

Eventos disponibles (filtrados por ID del chat):

- `onMessage`
- `onNewChatMember`
- `onLeftChatMember`

#### Métodos

- `send(message)`
- `mute(user)`
- `unmute(user)`
- `kick(user)`
- `ban(user)`
- `unban(user)`

*Todos reciben instancias de `User` o `Message`, según corresponda.*

---

### ✉️ Message

```js
const message = new bot.Message(text, options);
```

- `text`: contenido del mensaje (usa HTML para formato como **negrita**).
- `options.duration`: tiempo en milisegundos antes de que se borre automáticamente (opcional).

#### Métodos

- `sendTo(chat)`
- `edit(newText)`
- `delete()`
- `addButton(button)`

---

### 🔘 Button

```js
const button = new bot.Button(text, onClick, options);
```

- `text`: etiqueta del botón.
- `onClick(ctx)`: función que se ejecuta al hacer clic.
- `options.time_of_callback_life`: duración de la funcionalidad del botón (por defecto: 1 día).

---

### 👤 User

```js
const user = new bot.User(user_id, info);
```

> ⚠️ No se recomienda instanciar manualmente a menos que tengas acceso al `user_id` y la `info`.

Instancias de `User` se entregan automáticamente en los eventos.

#### Propiedades

- `user.user_id`
- `user.username`
- `user.first_name`
- etc...

Si creas un `User` manual sin `info`, deberás setear sus propiedades manualmente.

---

## 📦 Versión

Esta es la versión **1.0.0**, desarrollada en una tarde como una base simple pero funcional. 

Seguiré mejorándola, añadiendo nuevas opciones y corrigiendo errores pronto.

Si encuentras algún problema o tienes sugerencias, ¡házmelo saber!


---

Para la proxima version hay que cambiar un poco la estructura para adaptarla a un modelo más asincrono que declarativo.

const bot = await telbit(TOKEN_KEY);
const chat = await bot.chat(1234556789);

const message = await chat.message("my text");

await message.edit("another text");
await message.delete();

bot.onMessage = (message, chat, user) =>
{
    if(message.text === "super bad word")
    {
        await chat.ban(user);
        setTimeout(() => chat.unban(user), 100000)
    }
    else if(message.text === "soft bad word")
    {
        await chat.permisions(user, { write: false });
        setTimeout(() => chat.permisions(user, { write: true }), 100000);
    }
    else
    {
        await chat.send("Hello world!");
    }
}

Obvio que todo con sus catchs respectivos para manejar los errores


Ergo tendrimos

bot:
- onMessage //setter para evento de mensaje general;
- chat // method para crear un chat a partir de un id;
- me // getter con el usuario correspondiente a nuestro bot;

chat:
- id // getter del id del chat
- onMessage // setter para evento de mensaje espesífico para este chat;
- message // method para crear y enviar un mensaje
- ban // method para banear un usuario del chat
- unban // method para desbanear un usuario del chat
- kick // method para echar a un usuario del chat
- permisions // method para modificar los permisos de un usuario del chat

message:
- id // getter con el id del mensaje
- edit // method para editar el mensaje enviado;
- delete // method para eliminar el mensaje enviado;
- text // getter con el texto enviado
- user // getter con el usuario emisor (type telbit.user);
- time // getter con el tiempo de emisión

user: // solo getters
- id
- username
- firstname
- lastname
- bot