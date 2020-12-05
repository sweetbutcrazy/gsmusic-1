const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const handler = require("@tomdev/discord.js-command-handler");
const durasi = require("humanize-duration");
const client = new Client({
  disableMentions: "everyone",
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  ws: { intents: Intents.ALL }
});
client.config = require("./config.json");
client.logger = require("./util/logger.js");

const { clientID, clientSecret } = require("./config.json");

var prefix = client.config.prefix;
var cmdhandler = new handler(client, "/commands", prefix);

client.manager = new Manager({
  nodes: [
    {
      host: "localhost",
      port: 2333,
      password: "password",
      retryDelay: 5000
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
  autoPlay: true,
  plugins: [
    new Spotify({
      clientID,
      clientSecret
    })
  ]
})
  /*
   * Erela Event
   */
  .on("nodeConnect", node =>
    console.log(`Node "${node.options.identifier}" connected.`)
  )
  .on("nodeError", (node, error) =>
    console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    )
  )
  .on("trackStart", (player, track) => {
    const dura = durasi(track.duration, {
      language: "shortEn",
      languages: {
        shortEn: {
          y: () => "year",
          mo: () => "mnth",
          w: () => "week",
          d: () => "days",
          h: () => "hrs",
          m: () => "mins",
          s: () => "secs"
        }
      }
    });
    client.dura = dura;
    const start = new MessageEmbed()
      .setDescription(
        `🎶 **Started Playing**\n [${track.title}](${track.uri}) \n\`[${dura}]\``
      )
      .setThumbnail(track.displayThumbnail("hqdefault"))
      .setColor("#D70FB6")
      .setTimestamp()
      .setFooter(
        `Request by: ${track.requester.tag}`,
        track.requester.displayAvatarURL()
      );

    const channel = client.channels.cache.get(player.textChannel);
    channel.send({ embed: start });

     client.requester = `<@${track.requester.id}>`
    clearTimeout(client.ms);
  })
  .on("queueEnd", (player, track) => {
    const mbd = new MessageEmbed()
      .setColor("#D70FB6")
      .setAuthor("Add more songs before im leaving in 1 minutes.", 
                 "https://cdn.discordapp.com/emojis/745870325887008769.png", 
                 "https://discord.gg/gangsebelah" 
                 ) 
      .setFooter(`${client.user.username} ~ Gang Sebelah © 2020`);
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(client.requester, {embed: mbd });

    var ms = setTimeout(() => {
    player.destroy();
    const mbd = new MessageEmbed()
      .setColor("#D70FB6")
      .setAuthor(
        "Good Bye... im leaving the channel.",
        "https://cdn.discordapp.com/emojis/780091765696888852.gif",
        "https://discord.gg/gangsebelah"
      )
      .setDescription(`Thanks for using **${client.user.username}**`)
      .setImage(
        `https://cdn.discordapp.com/attachments/773766203914321980/782599730215518228/banner_server_15.png?width=960&height=422`
      )
      .setFooter(`${client.user.username} ~ Gang Sebelah © 2020`);
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({ embed: mbd });
    }, 60000)
    client.ms = ms;
  })
  .on("trackEnd", async player => {
    const autoplay = player.get("autoplay");
    if (autoplay === true) {
      const requester = player.get("requester");
      const oldidentifier = player.get("identifier");
      const identifier = player.queue.current.identifier;
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${oldidentifier}`;
      var res = await player.search(search, requester);
      player.queue.add(res.tracks[1]);
    }
  })
  .on("trackStuck", player => {
    const channel = client.channels.cache.get(player.textChannel);
    const mbd = new MessageEmbed()
      .setColor("RED")
      .setDescription("❌ Error when loading song! Track is stuck");
    channel.send({ embed: mbd });
    client.logger.log(
      `Error when loading song! Track is stuck in [${player.guild}]`,
      "error"
    );
    if (!player.voiceChannel) player.destroy();
  })

  .on("trackError", player => {
    const channel = client.channels.cache.get(player.textChannel);
    const mbd = new MessageEmbed()
      .setColor("RED")
      .setDescription("❌ Error when loading song! Track is error");
    channel.send({ embed: mbd });
    client.logger.log(
      `Error when loading song! Track is error in [${player.guild}]`,
      "error"
    );
    if (!player.voiceChannel) player.destroy();
  });
/*
 * Error & Client Event
 */
client.on("disconnect", () =>
  client.logger.log("Bot is disconnecting...", "warn")
);
client.on("reconnecting", () =>
  client.logger.log("Bot reconnecting...", "log")
);
client.on("warn", error => client.logger.log(error, "warn"));
client.on("error", error => {
  client.logger.log(error, "error");
  console.error(error);
});
process.on("unhandledRejection", error => {
  client.logger.log("Unhandled promise rejection:" + error, "error");
  console.error("Unhandled promise rejection:", error);
});
process.on("uncaughtException", error => {
  client.logger.log("Unhandled promise exception:" + error, "error");
  console.error("Unhandled promise exception:", error);
});

client.once("ready", () => {
  console.log(
    `ready with ${client.guilds.cache.size} guild & ${client.users.cache.size} users`
  );
  client.manager.init(client.user.id);
});

client.on("raw", d => client.manager.updateVoiceState(d));

client.on("message", async message => {
  cmdhandler.handleCommand(message);
});

/*
 * Event Handler
 */
readdirSync("./events/").forEach(file => {
  const event = require(`./events/${file}`);
  let eventName = file.split(".")[0];
  client.logger.log(`Loading Events Client ${eventName}`, "event");
  client.on(eventName, event.bind(null, client));
});

client.login(client.config.token);
