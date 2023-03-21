const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refreshslashcommands')
		.setDescription('refresh the slash commands!'),
	async execute(interaction) {  
	},
};