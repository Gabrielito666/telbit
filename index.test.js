const telbit = require(".");

const main = async() =>
{
    const bot = telbit(process.env.TEST_TOKEN);

    const mutePermissions = bot.permissionsFactory(false);
    const unmutePermissions = bot.permissionsFactory(true);

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

    const chat = await bot.chat(-1002591766578);

    chat.onLeftChatMember((msg, chat, user) =>
    {
        console.log("left member");
        setTimeout(msg.delete.bind(msg), 5000);
    });
    let yaSeHisoUnaVez = false;
    chat.onNewChatMember(async(msg, chat, user) =>
    {
        if(yaSeHisoUnaVez) return;
        else yaSeHisoUnaVez = true;
        /*
        const systemMsg1 = await chat.message("Probando escuchador de nuevos miembros");
        
        const systemMsg2 = await chat.message("Eliminando en 5");

        for(let i = 4; i >= 0; i--)
        {
            await new Promise(r => setTimeout(r, 1000));
            await systemMsg2.edit("Eliminando en " + i);
        }

        await systemMsg1.delete();
        await systemMsg2.delete();
        await msg.delete();

        const systemMsg3 = await chat.message("ahora te mutearemos por unos segundos");
        
        

        await chat.restrictUser(user, mutePermissions);

        const systemMsg4 = await chat.message("desmuteando en 5");
        for(let i = 4; i >= 0; i--)
        {
            await new Promise(r => setTimeout(r, 1000));
            await systemMsg4.edit("desmuteando en " + i);
        }

        await chat.restrictUser(user, unmutePermissions);
        await systemMsg3.delete();
        await systemMsg4.delete();

        await new Promise(r => setTimeout(r, 5000));
        */
        await chat.message("super... lo ultimo es probar si podemos mutear a todos tipo nigthmode");

        await chat.restrictAllChatUsers(mutePermissions);
        await chat.message("Espero que haya funcionado, ahora a esperar unos segundos que los desmuteo");

        await new Promise(r => setTimeout(r, 5000));

        await chat.restrictAllChatUsers(unmutePermissions);
        await chat.message("fin de estas pruebas");

    });

    bot.listeners.emitter.on("error", console.log);
}

main();