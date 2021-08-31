import { Client, Intents, TextChannel } from "discord.js"
import Logger from "paralogger"
import { Commands } from "./classes/commands"
import Listener from "./classes/listener"
import axios from "axios"

export class App {
  bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
  commands: Commands = new Commands(this)
  listener: Listener = new Listener(this)
  log: Logger = new Logger('bot', 'trace')

  started: boolean = false

  token: string

  banlist: any

  constructor(token: string) {
    this.token = token
  }

  async start() {
    this.fetchBanlist()

    this.bot.on('ready', () => {
      this.log.info('Started bot')
      this.commands.register(`${__dirname}/commands`)
      this.listener.startListener()
    })

    await this.bot.login(this.token)
    this.started = true
  }

  async fetchBanlist() {
    const data = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', {
      params: {
        banlist: 'tcg'
      }
    })
    const json = await data.data
    this.banlist = json.data.map(card => card.banlist_info.ban_tcg ? [card.id, card.banlist_info.ban_tcg] : undefined).filter(x => x)
  }

  async stop(event: string, error: any) {
    if (!this.started) return

    this.bot.destroy()
    this.log.info('Stopped bot with event: '+event)
    if (error) this.log.error(error as string)
    this.started = false
  }
}
