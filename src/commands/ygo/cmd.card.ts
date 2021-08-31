import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import YGOApi from 'ygoprodeck.js';
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
			const card = (await (new YGOApi()).getCards({fname}))[0]
			if (!card) return interaction.reply(`No results for ${fname}`)
			await interaction.reply({embeds: [embed_card(app, card)]})
		} catch (err) {
			app.log.error(err as string)
			await interaction.reply('Something went wrong!')
		}
	},
};
