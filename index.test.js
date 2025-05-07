const Telbit = require(".");

const bot = new Telbit(process.env.TEST_TOKEN);

bot.onMessage(async (msg, user, chat) =>
{
    if(msg.text === "/test")
    {
        await chat.send("Test message");
        console.log(user._first_name);

        await chat
        .send(
            new bot.Message("Test message with buttons")
            .addButton("Test button", () => { console.log("Button clicked"); })
            .addButton("Test button 2", () => { chat.send("Button 2"); })
        )

        const message2 = new bot.Message("Test message 2", { duration: 3000 });

        await message2.sendTo(chat);
    }
});