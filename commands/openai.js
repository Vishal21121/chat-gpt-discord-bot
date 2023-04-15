const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config()
const wait = require('node:timers/promises').setTimeout;
const {encode, decode} = require('gpt-3-encoder')

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

let length = 0;

const openai = new OpenAIApi(configuration);

let messageArr = [{ 'role': 'system', 'content': 'You are a sarcastic assistant and you makes sure that you give the pointwise response in a very simplified manner, so that it is understandable by everyone' }]

function addMessage(data, type) {
    let encoded = encode(data);
    console.log("length is:"+length);
    if(length+encoded.length>=3900){
        let val = messageArr[0]
        messageArr.splice(0,messageArr.length / 2)
        messageArr.unshift(val)
    }
    if (type == 'user') {
        messageArr.push({ 'role': type, 'content': data })
    } else if (type == "assistant") {
        messageArr.push({ "role": type, "content": data })
    }
    // console.log(messageArr)
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
        addMessage(data, 'user')
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messageArr,
            });
            console.log(completion.data);
            length = completion.data.usage.total_tokens;
            await interaction.followUp(`${completion.data.choices[0].message.content.slice(0, 2000)}`);
            addMessage(completion.data.choices[0].message.content, "assistant")
        } catch (error) {
            await interaction.followUp("unable to process your request right now please try after some time")
            console.log(error)
        }
    }
}