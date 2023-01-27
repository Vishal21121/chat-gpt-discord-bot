// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const fetch = require("node-fetch")
require("dotenv").config()
let githubVal;
const wait = require('node:timers/promises').setTimeout;

const token = process.env.TOKEN

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

// We recommend attaching a .commands property to your client instance so that you can access your commands in other files.
// The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();
// creating the path for reading the command files
const commandsPath = path.join(__dirname, 'commands');
// reading the files inside the command folder 
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	// getting the command content from a particular folder
	const command = require(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	// every Interaction is not slash command only isChatInputCommand() is a slash command so
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName)
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			githubVal =  await command.execute(interaction);
			// console.log(interaction.client.application.coverURL())
			
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}else if(interaction.isButton()){
		try{
			if(interaction.customId == "No" ){
				interaction.reply({content:"Please enter the correct github id",ephemeral:true})
			}
			else if(interaction.customId == "Yes" ){
				interaction.deferReply()
				let time = new Date()
				let actualTime = `${time.getFullYear()}-${time.getMonth().toString().length<2?"0"+parseInt(time.getMonth()+1):time.getMonth()+1}-${time.getDate()}`
				let response = await fetch(`https://api.github.com/search/commits?q=author:${githubVal}+committer-date:${actualTime}`,{
					method:'GET'
				})
				let data = await response.json()
				await wait(4000)
				const embed = new EmbedBuilder().setTitle(githubVal).setColor("DarkAqua") .addFields([
					{
						name:"Your Contributions",
						value:String(data.total_count)
					}
				])
				await interaction.editReply({embeds:[embed]});
			}
		}catch(err){
			console.log(err)
			
		}
	}
});

client.on("messageCreate",message=>{
	let val = [];
	let trigger = false
	if(message.attachments.size>0 && message.channelId!=process.env.channel_id)
	{
		message.attachments.forEach(element=>{
			if(element.contentType=="image/png" || element.contentType=="image/jpg" || element.contentType=="image/jpeg"){
				val.push(element.attachment)
				trigger = true
			}
		})
	}
	
	if(trigger && message.channelId!=process.env.channel_id && !message.author.bot){
		message.delete()
		const channel = client.channels.cache.get(process.env.channel_id);
		val.forEach(element=>{
			channel.send(element)
		})
	}
})


// Log in to Discord with your client's token
client.login(token);