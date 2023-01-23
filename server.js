import dotenv from "dotenv"
dotenv.config()
import cron from 'node-cron';
import { Client,  IntentsBitField } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch"

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

let userId = {
}

const getCount = async(author)=>{
    let time = new Date()
    let actualTime = `${time.getFullYear()}-${time.getMonth().toString().length<2?"0"+parseInt(time.getMonth()+1):time.getMonth()+1}-${time.getDate()}`
    let response = await fetch(`https://api.github.com/search/commits?q=author:${author}+committer-date:${actualTime}`,{
        method:'GET'
    })
    let data = await response.json()
    // console.log(actualTime)
    return data
}

cron.schedule("0 18 * * *", async() => {
    for(let key in userId){
        let preVal = await getCount(userId[key])
        if (preVal.total_count==0){
            let user = await client.users.fetch(key)
            user.send("Bhai kya kar raha hai tu kuch commit kar")
        }else{
            let user = await client.users.fetch(key)
            user.send("Bhai sahi jaa raha hai")
        }
    }
});

client.on("messageCreate",async(message)=>{
    let data;
    if (message.content.startsWith("/chat-gpt")){
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
    else if (message.content.startsWith("/chat-register")){
        let data = "/chat-register"
        let githubId = message.content.slice(data.length,message.content.length).trim()
        userId[message.author.id] = githubId
        message.author.send(`User registered with user id: ${message.author.id} and username ${githubId} `)
    }
})

   
