const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const fetch = require("node-fetch")

async function execute(interaction){
    await interaction.deferReply({ephemeral:true});
    const userName = interaction.options.getString("username")
    githubName = userName
    console.log("Github name is:",githubName)
    const userAccount = await fetch(`https://api.github.com/users/${userName}`)
    let actualAccount = await userAccount.json()
    if(Object.keys(actualAccount).length>2){
        let {login,html_url,name,bio} = actualAccount
        let infoList = [login,html_url,name,bio]
        infoList = infoList.map(element=>{
            if(element==null){
                return "nothing to display"
            }else{
                return element
            }
        })
        const embed = new EmbedBuilder().setColor("Aqua").setTitle(infoList[0]).setURL(infoList[1]).addFields([
            {
                name:"Name",
                value:infoList[2],
            },
            {
                name:"Bio",
                value: infoList[3],
            }
        ]).setImage(actualAccount.avatar_url).setFooter({ text: 'Still confused click on Your github userid'});
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId("Yes").setLabel("Yes").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("No").setLabel("No").setStyle(ButtonStyle.Danger)
        )
        await interaction.editReply({content:"Is this your profile?",ephemeral:true,embeds:[embed],components:[row]});
        return userName
    }
    else{
        await interaction.editReply(`User does not exist with the given userid ${userName}`)
        return userName
    }
}
module.exports = {
    data: new SlashCommandBuilder()
            .setName("my-commits")
            .setDescription("Giving the commit report of the user")
            .addStringOption(option=>
                option.setName("username")
                .setDescription("the input for getting the commit count")
                .setMaxLength(2000)
                .setRequired(true)
            ),
    execute:execute,
}