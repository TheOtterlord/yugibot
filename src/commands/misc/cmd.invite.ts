import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { App } from '../../app';

export default {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite YugiBot to your Discord server!'),
	async execute(app: App, interaction: CommandInteraction) {
    const embed = new MessageEmbed()
      .setTitle('Click to invite YugiBot!')
      .setURL('https://discord.com/api/oauth2/authorize?client_id=758292592814981120&permissions=242666032192&scope=bot%20applications.commands')
		await interaction.reply({embeds: [embed]})
	},
};
