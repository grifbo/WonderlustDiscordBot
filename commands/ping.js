const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with kys, deletes that, then Pong!'),
	async execute(interaction) {
    await interaction.reply('pong');
	},
};