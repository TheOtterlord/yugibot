import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import YGOApi from 'ygoprodeck.js';
import { App } from '../../app';
import embed_card from '../../utils/price_embed';

export default {
	data: new SlashCommandBuilder()
		.setName('price')
    .addStringOption((option) => option.setName('name').setDescription('Fuzzy name of the card').setRequired(true))
		.setDescription('Get the prices of a card.'),
	async execute(app: App, interaction: CommandInteraction) {
		const fname = interaction.options.data[0].value as string
		const card = (await (new YGOApi()).getCards({fname}))[0]
		if (!card) return interaction.reply(`No results for ${fname}`)
		await interaction.reply({embeds: [embed_card(card)]})
	},
};