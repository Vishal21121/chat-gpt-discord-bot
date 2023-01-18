require('dotenv').config()

const { Client,  IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    
});

client.login(process.env.TOKEN)

client.on('ready',()=>{
    console.log(`bot is online`)
    
})

client.on("messageCreate",async(message)=>{
    let data;
    if (message.content.includes("/chat-gpt")){
        data = message.content.slice(10,message.content.length)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: data,
            temperature: 0,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        message.reply(response.data.choices[0].text)
        
    }
    
})