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
        const fname = req[0].replace(/[<>]/g, "")
        const card = (await this.api.getCards({fname}))[0]
        if (!card) return message.reply(`No results for ${fname}`)
        const embed = embed_card(this.app, card)
        message.reply({embeds: [embed]})
      } catch (err) {
        this.app.log.error(err as string)
        message.reply('Something went wrong!')
      }
    })
  }
}
