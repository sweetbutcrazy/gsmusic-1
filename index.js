const { Client, MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");

const client = new Client();
client.config = require("./config.json");
const formatTime = require("./util/time.js");

var prefix = client.config.prefix;
var handler = require("@tomdev/discord.js-command-handler");
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
  autoplay: true,
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
})
  .on("nodeConnect", node =>
    console.log(`Node ${node.options.identifier} connected`)
  )
  .on("nodeError", (node, error) =>
    console.log(
      `Node ${node.options.identifier} had an error: ${error.message}`
    )
  )
  .on("trackStart", (player, track) => {
    const user = client.users.cache.get(track.requester.id);
    const embed = new MessageEmbed()
      .setAuthor(
        track.requester.username,
        user.displayAvatarURL({ dynamic: true })
      )
      .setTitle("Now Playing")
      .setColor("GREEN")
      .setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`)
      .setDescription(
        `:musical_note: ${
          track.title
        },
          true
        )}**`
      )
      .setTimestamp();
    client.channels.cache.get(player.textChannel).send({ embed: embed });
  })
  .on("queueEnd", player => {
    client.channels.cache.get(player.textChannel).send("Queue has ended.");

    player.destroy();
  });

client.once("ready", () => {
  console.log("I am ready!");
  client.manager.init(client.user.id);
});

client.on("raw", d => client.manager.updateVoiceState(d));

client.on("message", async message => {
  cmdhandler.handleCommand(message);
});

client.login(client.config.token);
