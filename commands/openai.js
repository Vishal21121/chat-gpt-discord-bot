const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config()
const wait = require('node:timers/promises').setTimeout;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


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
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: [{ role: "user", content: data }],
            temperature: 0,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        // console.log(completion.data.choices[0].message.content);
        await interaction.followUp(`${completion.data.choices[0].message.content}`);
    }
}