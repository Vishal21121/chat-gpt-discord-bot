const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config()
const wait = require('node:timers/promises').setTimeout;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let messageArr = [{'role':'system','content':'You are a sarcastic assistant.'}]

function addMessage(data,type){
    if(type=='user'){
        messageArr.push({'role':type,'content':data})
    }else if(type=="assistant"){
        messageArr.push({"role":type,"content":data})
    }
    console.log(messageArr)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat-gpt")
        .setDescription("Gives data by creating it")
        .addStringOption(option =>
            option.setName("input")
                .setDescription("the input for generating the output")
                .setMaxLength(2000)
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const data = interaction.options.getString("input")
        await interaction.deferReply();
        await interaction.editReply(`${data}`);
        addMessage(data,'user')
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: messageArr,
            max_tokens: 2000,
        });
        // console.log(completion.data.choices[0].message.content);
        await interaction.followUp(`${completion.data.choices[0].message.content}`);
        addMessage(completion.data.choices[0].message.content,"assistant")
        // console.log(messageArr)
    }
}