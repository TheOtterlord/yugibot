<div align="center">
  <h1>YugiBot</h1>
</div>

A Yu-Gi-Oh! Discord bot in the very early stages of inception.


## Self-hosting the bot

1. Add your bot `TOKEN` to `.env` following the example in `.env.example`.
2. Start the bot using `npm run start`
3. (*optional*) When developing the bot, use `npm run dev` to get `nodemon` hot reload

## Adding Commands

You can add commands to the `src/commands` directory by creating a file matching `cmd.*.ts`.
Use the `cmd.ping.ts` file in `src/commands/misc` as an guide.

## Credits

All card data is from the [YGOProDeck](https://ygoprodeck.com) API.
