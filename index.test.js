const telbit = require(".");

const main = async() =>
{
    const bot = telbit(process.env.TEST_TOKEN);

    bot.onMessage(async(msg, chat, user) =>
    {
        if(msg.text === "/ping")
        {
            const response = await chat.message("pong");

            setTimeout(response.delete.bind(response), 3000);

            const res2 = await chat.message("mensaje 2");
            setTimeout(()=>res2.edit("mensaje 3!"), 3000);
        }
    })
}

main();