import { Message } from "discord.js"
import { App } from "../app"
import YGOApi from "ygoprodeck.js"
import embed_card from "../utils/cardembed"

/**
 * This is the text channel listener for card embeds.
 */
export default class Listener {
  app: App
  api: YGOApi = new YGOApi()

  constructor(app: App) {
    this.app = app
  }

  startListener() {
    this.app.bot.on("messageCreate", async (message: Message): Promise<any> => {
      try {
        if (message.author.bot) return
        if (message.channel.type === "DM")
        message.content = message.content.toLowerCase()
        let req = message.content.match(/<[^>]*>/)
        if (!req) return
        if (req[0].startsWith('<:') || /<@!?[0-9]/.exec(req[0])) return
        this.app.log.trace(`Detected ${req} in ${message.guild?.name}`)
        const fname = req[0].replace(/[<>]/g, "")
        const card = (await this.api.getCards({fname}))[0]
        if (!card) return message.reply(`No results for ${fname}`)
        const embed = embed_card(this.app, card)
        message.reply({embeds: [embed]})
      } catch (err: any) {
        if (err.message === 'Request failed with status code 400') return message.reply(`No results found`)
        this.app.log.error(`${err.name}: ${err.message}\n${err.stack}`)
        message.reply('Something went wrong!')
      }
    })
  }
}
