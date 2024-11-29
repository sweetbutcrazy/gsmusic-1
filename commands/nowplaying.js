const { MessageEmbed } = require("discord.js");
const { progressbar } = require('../../utils/progressbar.js')

module.exports = {
    name: "nowplaying", //neded
    aliases: ["np"],
    category: "Main",
    description: "This is an nowplaying command",
    usage: "nowplaying",
    run: async function (client, command, args, message) { //needed
        const player = message.client.manager.get(message.guild.id);
        
        if (!player) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no player for this guild.");
            return message.channel.send(thing);	
        }

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }

        const song = player.queue.current

        const emojimusic = "<:music:784761922158460938>";

        // Progress Bar
        var total = song.duration;
        var current = player.position;
        var size = 30;
        var line = '─';
        var slider = '<:GS:780237451313807450>';

        let thing = new MessageEmbed()
            .setDescription(`${emojimusic} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration)}]\``)
            .setThumbnail(song.displayThumbnail("3"))
            .setColor(client.color)
            .addField("\u200b", progressbar(total, current, size, line, slider))
            .addField("\u200b", `\`${convertTime(current)}/ ${convertTime(total)}\``)
            .setFooter(`${message.client.user.username} ~ Gang Sebelah © 2020`);
        return message.channel.send(thing);
	
  	}
};
