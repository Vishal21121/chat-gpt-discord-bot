const { SlashCommandBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


module.exports = {
  data: new SlashCommandBuilder()
    .setName("generate-image")
    .setDescription("Generates images")
    .addStringOption(option =>
      option.setName("input")
        .setDescription("the input for generating the image")
        .setMaxLength(2000)
        .setRequired(true)
    )
  ,
  async execute(interaction) {
    const data = interaction.options.getString("input")
    await interaction.deferReply();
    await interaction.editReply(`${data}`);
    try {
      const response = await openai.createImage({
          prompt: data,
          n: 1,
          size: "512x512",
      });
      await wait(4000)
      await interaction.followUp(response.data.data[0].url);
  } catch (err) {
    await interaction.followUp(`sorry cannot generate image for the input *${data}*`);
  }
  }

}