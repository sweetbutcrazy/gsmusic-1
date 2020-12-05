const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");


module.exports = {
    name: "lyrics", //neded
    aliases: ["ly", "lyric"],
    category: "Main",
    description: "This is an example command",
    usage: "lyrics",
    run: async function (client, command, args, message) {
        const player = message.client.manager.get(message.guild.id);

        let song = args.join(" ");

        if (!song && !player || !song && !player.queue.current) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }

        if (!song && player.queue.current) song = player.queue.current.title;

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(song, "");
            if (!lyrics) lyrics = `No lyrics found.`;
        } catch (error) {
            console.error(error)
            lyrics = `Usage: ${message.client.prefix}ly <Song Name>`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`**Lyrics** of **${song}**\n${lyrics}`)
            .setFooter(`${message.client.user.username} ~ Gang Sebelah © 2020`);

        if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed);
	
  	}
}; 
