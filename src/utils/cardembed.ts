import { MessageEmbed } from "discord.js"
import { Card } from "ygoprodeck.js/lib/types/index"
import { App } from "../app"

export default function embed_card(app: App, card: Card) {
  const embed = new MessageEmbed()
    .setTitle(card.name)
    // .setURL(`https://db.ygoprodeck.com/card/?search=${card.name}`)
    .setColor(card.attribute ? 0xc67548 : (card.type.toLowerCase().includes('spell') ? 0x00aaff : 0xff00aa))
    .setFooter(`${card.id}`)
    .setImage(`https://storage.googleapis.com/ygoprodeck.com/pics/${card.id}.jpg`)
  let stats = `**Type:** ${card.attribute ? `${card.race}/${card.type.replace('Monster','')}` : card.type} `
  if (card.attribute) {
    stats += `**Attribute:** ${card.attribute}\n`
    stats += card.level ? `**Level:** ${card.level} ` : `**Link**: ${card.linkval} `
    stats += `**ATK:** ${card.atk} `
    if (card.def) stats += `**DEF:** ${card.def} `
  }
  stats += `\n**CardMarket:** €${card.card_prices[0].cardmarket_price} `
  stats += `**TCGPlayer:** $${card.card_prices[0].tcgplayer_price} `
  stats += `**eBay:** $${card.card_prices[0].ebay_price}\n`
  stats += `**Banlist**: ${app.banlist.find(x => +x[0] === +card.id)?.[1] ?? 'Unlimited'}`
  embed.setDescription(stats)
  embed.addField('Card Text', card.desc.length > 1024 ? `${card.desc.substring(0, 1020)}....` : card.desc)
  return embed
}
