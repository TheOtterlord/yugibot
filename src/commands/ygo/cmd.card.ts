import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Card } from 'ygoprodeck.js/lib/types';
import { App } from '../../app';
import embed_card from '../../utils/cardembed';

export default {
	data: new SlashCommandBuilder()
		.setName('card')
    .addStringOption((option) => option.setName('name').setDescription('Fuzzy name of the card').setRequired(true))
		.setDescription('Search for a card!'),
	async execute(app: App, interaction: CommandInteraction) {
		try {
			const fname = interaction.options.data[0].value as string
			const card = app.client.search(fname)[0]
			if (!card) return interaction.reply(`No results for ${fname}`)
			await interaction.reply({embeds: [embed_card(app, card)]})
		} catch (err: any) {
			if (err.message === 'Request failed with status code 400') return interaction.reply(`No results found`)
      app.log.error(`${err.name}: ${err.message}\n${err.stack}`)
      interaction.reply('Something went wrong!')
		}
	},
};
