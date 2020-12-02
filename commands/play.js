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
            "**example: \nn.play ncs \nn.play https://www.youtube.com/watch?v=Nxs_mpWt2BA**"
        }
      });

    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id
    });

    if (player.state !== "CONNECTED") player.connect();

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
        player.queue.add(res.tracks[0]);

        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
        return message.channel.send({
          embed: {
            color: "0F1621",
            description: `enqueuing \`${res.tracks[0].title}\`.`
          }
        });
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
            color: "#0F1621",
            description: `enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`
          }
        });
      case "SEARCH_RESULT":
        let max = 5,
          collected,
          filter = m =>
            m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;

        const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index} - \`${track.title}\``)
          .join("\n");
        const mbd = new MessageEmbed() 
        .setColor("RED")
        .setDescription(results) 
        .setFooter(`<a:60sec:783543097790824479> ${client.user.username} ~ Gang Sebelah © 2020`)
        message.channel.send({ embed: mbd });

        try {
          collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"]
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.channel
            .send("**You didn't provide a selection.**")
            .then(m => m.delete({ timeout: 5000 }));
        }

        const first = collected.first().content;

        if (first.toLowerCase() === "end") {
          if (!player.queue.current) player.destroy();
          return message.channel
            .send("Cancelled selection.")
            .then(m => m.delete({ timeout: 5000 }));
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1)
          return message.reply(
            `the number you provided too small or too big (1-${max}).`
          ).then(m => m.delete({ timeout: 5000 }));

        const track = res.tracks[index];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
        return message.reply(`enqueuing \`${track.title}\`.`);
    }
  }
};
