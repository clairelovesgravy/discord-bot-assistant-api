require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, Partials } = require('discord.js');
const{ OpenAI } = require ('openai');
const {uploadAttachmentsToOpenAI} = require('./file_process');

const openai = new OpenAI(process.env.OPENAI_API_KEY);


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => { console.log('Bot is ready! Let’s go'); });

authorizedChannelId = process.env.AUTHORIZEDCHANNELID.split(',');
authorizedUserId = process.env.AUTHORIZEDUSERID.split(',');



const threadMap = [];
function getOpenaiThreadId(discordThreadId) {
    for (const mapping of threadMap) {
        if (mapping.discordThreadId === discordThreadId) {
            return mapping.openaiThreadId;
        }
    }
    return null; // or any other appropriate value indicating 'not found'
}

function addThreadToMap(discordThreadId, openaiThreadId) {
    // Optional: Add validation for discordThreadId and openaiThreadId
    threadMap.push({ discordThreadId, openaiThreadId });
}



client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return;

        // Respond to every message in DM
        if (message.channel.type === ChannelType.DM && authorizedUserId.includes(message.author.id)) 
        {
            message.reply(`Hey there! How can I help you?`);
            // generate response from openai api
            // create a thread and fetch the thread id
            const discordThreadId = message.author.id;
            let openaiThreadId = getOpenaiThreadId(discordThreadId);
            if (!openaiThreadId) {
                // Create a new thread in OpenAI
                const openaiThread = await openai.beta.threads.create();
                addThreadToMap(discordThreadId, openaiThread.id);
                openaiThreadId = getOpenaiThreadId(discordThreadId);
            }
            // add a new message in the thread
            const fileIds = await uploadAttachmentsToOpenAI(message);
            console.log ("fileIds: ", fileIds)
            const threadMessage = await openai.beta.threads.messages.create(
                 openaiThreadId,
                { 
                    role: "user", 
                    content: message.content,
                    file_ids: fileIds }
              );
            //create a run
            const run = await openai.beta.threads.runs.create(
                openaiThreadId,
                { assistant_id: process.env.ASSISTANT_ID}
              );
            //get response from run
            try {
                const response = await getAnswer(openaiThreadId, run.id);
                const responseChunks = splitResponse(response);
                // Send each chunk as a separate message
                for (const chunk of responseChunks) {
                    await message.reply(chunk);
                }       
            } catch (error) {
                message.reply("An error occurred while processing your request.");
            }
        }



        // In guild channels, check if the bot is mentioned
        if (message.channel.type === ChannelType.GuildText && authorizedChannelId.includes(message.channelId)) {
            if(!message.mentions.users.has(client.user.id))
                return;
            // Respond only if the bot is mentioned
            else {
                const userId = message.author.id;
                message.reply(`Hey there! <@${userId}>`);


            // generate response from openai api
            // create a thread and fetch the thread id
            const discordThreadId = message.channelId + message.author.id;
            let openaiThreadId = getOpenaiThreadId(discordThreadId);
            if (!openaiThreadId) {
                // Create a new thread in OpenAI
                const openaiThread = await openai.beta.threads.create();
                addThreadToMap(discordThreadId, openaiThread.id);
                openaiThreadId = getOpenaiThreadId(discordThreadId);
            }
            // add a new message in the thread
            const threadMessage = await openai.beta.threads.messages.create(
                 openaiThreadId,
                { role: "user", content: message.content }
              );
            //create a run
            const run = await openai.beta.threads.runs.create(
                openaiThreadId,
                { assistant_id: process.env.ASSISTANT_ID}
              );
            //get response from run
            try {
                const response = await getAnswer(openaiThreadId, run.id);
                const responseChunks = splitResponse(response);
                // Send each chunk as a separate message
                for (const chunk of responseChunks) {
                    await message.reply(chunk);
                }       
            } catch (error) {
                message.reply("An error occurred while processing your request.");
            }
            }
        }
    }catch (error) {
        console.log(error);
    }
});


function splitResponse(response) {
    const maxChunkSize = 2000;
    let chunks = [];

    for (let i = 0; i < response.length; i += maxChunkSize) {
        chunks.push(response.substring(i, i + maxChunkSize));
    }
    return chunks;
}


async function getAnswer(threadId, runId) {
    return new Promise(async (resolve, reject) => {
        const checkRunStatus = async () => {
            try {
                const getRun = await openai.beta.threads.runs.retrieve(threadId, runId);
                console.log("Run Status: ", getRun.status);           
                if (getRun.status === "completed") {
                    const messages = await openai.beta.threads.messages.list(threadId);
                    const response = messages.data[0].content[0].text.value;
                    console.log("Response: ", response);
                    resolve(response);
                } else {
                    setTimeout(checkRunStatus, 500);
                }
            } catch (error) {
                console.error("Error in getAnswer: ", error);
                reject(error);
            }
        };
        checkRunStatus();
    });
  }
  