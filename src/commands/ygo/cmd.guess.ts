import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'
import { App } from '../../app'

function testForResponse(message: Message, channelId: string, name: string): true | undefined {
  if (message.author.bot) return
  if (message.channel.type !== 'GUILD_TEXT') return
  if (message.channelId !== channelId) return
  if (message.content.toLowerCase() === name.toLowerCase()) return true
}

export default {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('You have 60 seconds to guess the card name from an image'),
	async execute(app: App, interaction: CommandInteraction) {
		try {
      let card = app.client.cards?.[Math.floor(Math.random() * app.client.cards.length)]
      if (!card) throw Error('No cards found')

      interaction.reply({
        content: ':stopwatch: You have 60 seconds to guess the card below!',
        files: [`https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${card.id}.jpg`]
      })

      let correct = false

      function handleMessage(message: Message) {
        if (testForResponse(message, interaction.channelId, card?.name ?? '')) {
          correct = true
          app.bot.off('messageCreate', handleMessage)
          interaction.followUp({
            content: `:white_check_mark: <@${message.author.id}> guessed the card name correctly!`
          })
        }
      }

      app.bot.on('messageCreate', handleMessage)

      setTimeout(() => {
        if (correct) return
        app.bot.off('messageCreate', handleMessage)
        interaction.followUp({
          content: ':x: You have run out of time! The correct card was: ' + card?.name
        })
      }, 60000)
		} catch (err: any) {
      app.log.error(`${err.name}: ${err.message}\n${err.stack}`)
      interaction.reply('Something went wrong!')
		}
	},
}
