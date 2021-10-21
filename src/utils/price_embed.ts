import { MessageEmbed } from "discord.js"
import { Card } from "ygoprodeck.js/lib/types/index"

export default function embed_card(card: Card) {
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setColor(card.attribute ? 0xc67548 : (card.type.toLowerCase().includes('spell') ? 0x00aaff : 0xff00aa))
    .setFooter(`${card.id}`)
  let stats = `**CardMarket:** €${card.card_prices[0].cardmarket_price} `
  stats += `**TCGPlayer:** $${card.card_prices[0].tcgplayer_price} `
  stats += `**eBay:** $${card.card_prices[0].ebay_price}\n`
  stats += `**Amazon:** $${card.card_prices[0].amazon_price} `
  stats += `**CoolStuffInc:** $${card.card_prices[0].coolstuffinc_price}`
  embed.setDescription(stats)

  const sets = card.card_sets?.map(set => {
    return {
      name: `${set.set_name} ${set.set_rarity_code}`,
      value: `$${set.set_price}`
    }
  })
  embed.addFields(sets!)
  return embed
}
