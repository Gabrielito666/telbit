const Events = require("events");  
const emitter = new Events();
const axios = require("axios");
const https = require("https");
const ipv4Agent = new https.Agent({ family: 4 });

const apiMethods = (BOT_TOKEN) =>
{
    const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

    const callAPI = async (httpMethod, telegamMethod, payload) =>
    {
        
        if(httpMethod === "GET")
        {
            return await axios.get(`${API_URL}/${telegamMethod}`, { httpsAgent: ipv4Agent, params: payload});
            
        }
        else if(httpMethod === "POST")
        {
            return await axios.post(`${API_URL}/${telegamMethod}`, payload, {httpsAgent: ipv4Agent});   
        }
    };
    

    const getMe = async() =>
    {
        try
        {
            const res = await callAPI("GET", "getMe");
            const data = res.data;
            if(!data.ok || !data.result) throw new Error("Telegram conection error");

            return data.result;
            
        }
        catch(err)
        {
            emitter.emit("error", err);
            return null;
        }
    }

    let offset = 0;
    const drop_pending_updates = async() =>
    {
        try
        {
            const res = await callAPI("GET", `getUpdates`, {offset: offset, timeout:30});
            const data = res.data;
    
            for (const update of data.result || []) offset = update.update_id + 1; //solo llega al offset actual
        }
        catch (err)
        {
            emitter.emit("error", err);
        }
    }

    const getUpdates = async() =>
    {
        try
        {
            const res = await callAPI("GET", `getUpdates`, {offset: offset, timeout:30});
            const data = res.data;
    
            for (const update of data.result || [])
            {
                offset = update.update_id + 1;
                emitter.emit("update", update);
            }
        }
        catch (err)
        {
            emitter.emit("error", err);
        }
    };
    
    const sendMessage = async(chatId, text) =>
    {
        try
        {
            const res = await callAPI("POST", `sendMessage`, { chat_id: chatId, text });
            if(res.data.ok && res.data.result)
            {
                return res.data.result;
            }
            else
            {
                emitter.emit("error", new Error("send message error"));
                return null;
            }
        }
        catch(err)
        {
            emitter.emit("error", err);
            return null;
        }
    }
    const deleteMessage = async (chatId, messageId) =>
    {
        try {
            const res = await callAPI("POST", "deleteMessage", {
                chat_id: chatId,
                message_id: messageId
            });
            if(res.data.ok && res.data.result)
            {
                return res.data.result;
            }
            else
            {
                emitter.emit("error", new Error("delete message error"));    
                return null;
            }
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };
    const editMessage = async (chatId, messageId, newText) =>
    {
        try 
        {
            const res = await callAPI("POST", "editMessageText", {
                chat_id: chatId,
                message_id: messageId,
                text: newText
            });
            if(res.data.ok && res.data.result)
            {
                return res.data.result;
            }
            else
            {
                emitter.emit("error", new Error("edit message error"));    
                return null;
            }
        }
        catch (err)
        {
            emitter.emit("error", err);
            return null;
        }
    };
    
    const banUser = async (chatId, userId) =>
    {
        try {
            const res = await callAPI("POST", "banChatMember", {
                chat_id: chatId,
                user_id: userId
            });
            return res.data;
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };
    const unbanUser = async (chatId, userId) =>
    {
        try {
            const res = await callAPI("POST", "unbanChatMember", {
                chat_id: chatId,
                user_id: userId
            });
            return res.data;
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };
    const kickUser = async (chatId, userId) =>
    {
        try {
            const res = await callAPI("POST", "banChatMember", {
                chat_id: chatId,
                user_id: userId,
                until_date: Math.floor(Date.now() / 1000) + 60 // 1 minuto
            });
            return res.data;
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };
    
    const restrictUser = async (chatId, userId, permissions) =>
    {
        try {
            const res = await callAPI("POST", "restrictChatMember", {
                chat_id: chatId,
                user_id: userId,
                permissions,
                until_date: 0 // 0 es indefinido
            });
            return res.data;
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };

    const restrictChat = async (chatId, permissions) =>
    {
        try {
            const res = await callAPI("POST", "setChatPermissions", {
                chat_id: chatId,
                permissions
            });
            return res.data;
        } catch (err) {
            emitter.emit("error", err);
            return null;
        }
    };

    const listeners = () =>
    {
        let interval;
        let running = false;
        const start = async() =>
        {
            await drop_pending_updates();
            running = true;
            while(running)
            {
                await getUpdates();
            }
        };
        const stop = () =>
        {
            if(running)
            {
                running = false;
                clearInterval(interval);
            }
        };
        return { start, stop, emitter }
    }


    return {
        listeners,
        sendMessage,
        getMe,
        deleteMessage,
        editMessage,
        banUser,
        unbanUser,
        kickUser,
        restrictUser,
        restrictChat
    };
}
module.exports = apiMethods;