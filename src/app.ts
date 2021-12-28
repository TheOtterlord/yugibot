import { ActivitiesOptions, Client, Intents, PresenceStatusData } from "discord.js"
import Logger, { logToConsole } from "paralogger"
import { Commands } from "./classes/commands"
import Listener from "./classes/listener"
import axios from "axios"
import YGOClient from 'ygoprodeck.js'

export class App {
  bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
  client: YGOClient
  commands: Commands = new Commands(this)
  listener: Listener = new Listener(this)
  log: Logger = new Logger('bot')

  started: boolean = false

  token: string

  banlist: any

  constructor(token: string) {
    this.token = token
    this.client = new YGOClient()
  }

  async start() {
    this.log.on('log', logToConsole())

    await this.loadCards()

    this.bot.on('ready', () => {
      this.log.info(`Started bot: Serving ${this.bot.guilds.cache.size} guilds`)
      this.commands.register(`${__dirname}/commands`)
      this.listener.startListener()
    })

    await this.bot.login(this.token)
    this.started = true
    this.active()

    setInterval(() => {
      this.loadCards()
    }, 24 * 60 * 60 * 1000)
  }

  async loadCards() {
    await this.client.load()
    this.fetchBanlist()
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

  active(activity: ActivitiesOptions = {name: `Yu-Gi-Oh! in ${this.bot.guilds.cache.size} servers`, type: 'PLAYING'}) {
    this.setPresence('online', activity)
    setTimeout(() => {
      this.setPresence('idle', activity)
    }, 300000)
  }

  setPresence(status: PresenceStatusData, activity: ActivitiesOptions) {
    if (!this.started) return

    this.bot.user?.setPresence({
      status: status,
      activities: [activity]
    })
  }

  async stop(event: string, error: any) {
    if (!this.started) return
    this.started = false

    if (error) this.log.error(error as string)
    this.bot.destroy()
    this.log.info('Stopped bot with event: '+event)
  }
}
