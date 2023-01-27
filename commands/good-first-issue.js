const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
const fetch = require("node-fetch")
module.exports = {
    data: new SlashCommandBuilder()
            .setName("good-first-issue")
            .setDescription("Gives good first issues")
            ,
    async execute(interaction) {
            await interaction.deferReply();
                let response = await fetch("https://api.github.com/search/issues?q=label:good-first-issue")
                let data = await response.json()
                let embeds = [];
                for(i=0;i<=9;i++){
                    let element = data.items[i]
                    html = element.html_url
                    title = element.title
                    state = element.state
                    body = element.body.slice(0,500)
                    let labels = ""
                    element.labels.forEach(element => {
                        labels = `${labels} ${element.name}`
                    });
                    const value = new EmbedBuilder().setTitle(title).setURL(html).setDescription(body).addFields({name:"Labels",value:labels},{name:"State",value:state}).setColor("Aqua")
                    embeds.push(value)
                }
                await wait(4000)
                await interaction.editReply({content:"Few good first issues are listed below:",embeds:[...embeds]});
            }    
}