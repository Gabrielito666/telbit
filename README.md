```markdown
# Telbit 2.0.0

**Telbit** es una librería asincrónica y simplificada para la creación de bots de Telegram. Ya no depende de Telegraf: ahora utiliza métodos propios para comunicarse directamente con la API de Telegram y es compatible con las últimas versiones de Node.js.

> 🚀 Instalación:

```bash
npm install telbit
```

---

## Ejemplo básico

```js
const bot = await telbit(TOKEN_KEY);
const chat = await bot.chat(1234556789);

const message = await chat.message("my text");

await message.edit("another text");
await message.delete();

bot.onMessage = async (message, chat, user) => {
    if(message.text === "super bad word") {
        await chat.ban(user);
        setTimeout(() => chat.unban(user), 100000);
    }
    else if(message.text === "soft bad word") {
        await chat.permisions(user, { write: false });
        setTimeout(() => chat.permisions(user, { write: true }), 100000);
    }
    else {
        await chat.send("Hello world!");
    }
}
```

> ✨ No olvides envolver tus llamadas con `try/catch` para manejar errores adecuadamente.

---

## API

### `bot`

- `onMessage`: Setter para manejar todos los mensajes.
- `onLeftChatMember`: Setter para cuando un miembro sale de cualquier chat.
- `onNewChatMember`: Setter para cuando entra un nuevo miembro a cualquier chat.
- `chat(id)`: Crea una instancia `chat` a partir de un ID.
- `me`: Retorna el `user` correspondiente a tu bot.
- `permissionsFactory`: Atajo para crear objetos de permisos fácilmente reutilizables. Útil para `restrictUser` o `restrictAllChatUsers`.

### `chat`

- `id`: ID del chat.
- `onMessage`: Setter específico para mensajes de este chat.
- `onLeftChatMember`: Evento para miembros que se van de este chat.
- `onNewChatMember`: Evento para nuevos miembros en este chat.
- `message(text)`: Envía un mensaje y retorna una instancia `message`.
- `ban(user)`: Banea un usuario del chat.
- `unban(user)`: Desbanea un usuario.
- `kick(user)`: Echa a un usuario del grupo.
- `restrictUser(user, permissions)`: Modifica los permisos de un usuario.
- `restrictAllChatUsers(permissions)`: Modifica los permisos de todos los usuarios del chat.

### `message`

- `id`: ID del mensaje.
- `edit(text)`: Edita el contenido del mensaje.
- `delete()`: Elimina el mensaje.
- `text`: Texto original del mensaje.
- `user`: Usuario que envió el mensaje (`telbit.user`).
- `time`: Timestamp de emisión.

### `user`

Todos son getters:

- `id`
- `username`
- `firstname`
- `lastname`
- `bot`: Booleano que indica si es un bot.

---

## Licencia

MIT © 2025 — Hecho con cariño ✨

¿Tienes sugerencias o errores? ¡Haz un issue o pull request!
```