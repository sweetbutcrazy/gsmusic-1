const { MessageEmbed } = require("discord.js");
const durasi = require("humanize-duration");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Main",
  description: "This is an example command",
  usage: "play [title | url]",
  run: async function(client, command, args, message) {
    const { channel } = message.member.voice;

    if (!channel)
      return message.channel.send({
        embed: {
          color: "#D70FB6",
          description: "You Need To Join Voice Channel!"
        }
      });
    if (!args.length)
      return message.channel.send({
        embed: {
          color: "#D70FB6",
          description:
            "**usage: \n``n.play ncs \nn.play https://www.youtube.com/watch?v=Nxs_mpWt2BA``**"
        }
      });

    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id
    });

    if (player.state !== "CONNECTED") player.connect();
    player.set("autoplay", false);
    const search = args.join(" ");
    let res;

    try {
      res = await player.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.reply(
        `there was an error while searching: ${err.message}`
      );
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return message.reply("there were no results found.");
      case "TRACK_LOADED":
        var track = res.tracks[0];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        } else {
          return message.channel.send({
            embed: {
              color: "#D70FB6",
              description: `**Songs added to queue **\n[${track.title}](${track.uri}) - \`[${client.dura}]\``,
              thumbnail: {
                url: `${track.displayThumbnail("hqdefault")}`
              },
              timestamp: new Date(),
              footer: {
                text: `Request by: ${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL()}`
              }
            }
          });
        }
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          player.play();

        return message.channel.send({
          embed: {
            color: "#D70FB6",
            description: `**Playlist added to queue **\n${res.tracks.length} Songs **${res.playlist.name}** - \`[${client.dura}]\``,
            thumbnail: {
              url: `${res.tracks[0].displayThumbnail("hqdefault")}`
            },
            timestamp: new Date(),
            footer: {
              text: `Request by: ${message.author.tag}`,
              icon_url: `${message.author.displayAvatarURL()}`
            }
          }
        });
      case "SEARCH_RESULT":
        var track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        } else {
          return message.channel.send({
            embed: {
              color: "#D70FB6",
              description: `**Songs added to queue **\n[${track.title}](${track.uri}) - \`[${client.dura}]\``,
              thumbnail: {
                url: `${track.displayThumbnail("hqdefault")}`
              },
              timestamp: new Date(),
              footer: {
                text: `Request by: ${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL()}`
              }
            }
          });
        }
    }
  }
};
