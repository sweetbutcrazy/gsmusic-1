const { MessageEmbed } = require("discord.js");

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
    player.set("autoplay", false) 
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
            case 'TRACK_LOADED':
                var track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size) { 
                    return player.play();
                } else {
                    var thing = new MessageEmbed()
                        .setColor("#D70FB6")
                        .setTimestamp()
                        .setThumbnail(track.displayThumbnail("hqdefault"))
                        .setDescription(`${emojiaddsong} **Song added to queue **\n[${track.title}](${track.uri}) - \`[${durasi}]\``)
                        .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(thing);
                }
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                var thing = new MessageEmbed()
                    .setColor("#D70FB6")
                    .setTimestamp()
                    .setThumbnail(res.tracks[0].displayThumbnail("hqdefault"))
                    .setDescription(`${emojiplaylist} **Playlist added to queue **\n${res.tracks.length} Songs **${res.playlist.name}** - \`[${durasi}]\``)
                    .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(thing);
            case 'SEARCH_RESULT':
                var track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size) {
                    return player.play();
                } else {
                    var thing = new MessageEmbed()
                        .setColor("#D70FB6")
                        .setTimestamp()
                        .setThumbnail(track.displayThumbnail("hqdefault"))
                        .setDescription(` **Songs added to queue **\n[${track.title}](${track.uri}) - \`[${durasi}]\``)
                        .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(thing);
                }
        }
    }
}
