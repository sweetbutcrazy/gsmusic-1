const { Client, Collection, Intents , MessageEmbed} = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const handler = require("@tomdev/discord.js-command-handler")
const durasi = require("humanize-duration");
const client = new Client({
    disableMentions: "everyone",
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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
  .on("nodeConnect", node => console.log(`Node "${node.options.identifier}" connected.`))
  .on("nodeError", (node, error) => console.log(
    `Node "${node.options.identifier}" encountered an error: ${error.message}.`
  ))
  .on("trackStart", (player, track) => {
  const dura = durasi(track.duration, { 
language: "shortEn",
  languages: {
    shortEn: {
      y: () => "Y",
      mo: () => "MO",
      w: () => "W",
      d: () => "D",
      h: () => "H",
      m: () => "M",
      s: () => "S",
      ms: () => "MS",
    },
  },
})
  const start = new MessageEmbed()
        .setDescription(`🎶 **Started Playing**\n [${track.title}](${track.uri}) - \n\`[${dura}]\``)
        .setThumbnail(track.displayThumbnail("hqdefault"))
        .setColor("BLACK")
        .setTimestamp()
        .setFooter(`Request by: ${track.requester.tag}`, track.requester.displayAvatarURL());
    
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({embed: start})
  })
  .on("queueEnd", player => {
    const mbd = new MessageEmbed() 
    .setColor("RED")
    .setTitle("Good Bye... im leaving the channel.")
    .setDescription(`Thanks for using **${client.users.username}**`) 
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({embed: mbd} 
    player.destroy();
  });

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
  console.log("I am ready!");
  client.manager.init(client.user.id);
});

client.on("raw", d => client.manager.updateVoiceState(d));

client.on("message", async message => {
  cmdhandler.handleCommand(message);
});

readdirSync("./events/").forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.logger.log(`Loading Events Client ${eventName}`, "event");
    client.on(eventName, event.bind(null, client));
});

client.login(client.config.token);
