const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "pause", //neded
    aliases: [],
    category: "Main",
    description: "This is an pause command",
    usage: "pause",
    run: async function (client, command, args, message) { //needed
        const { channel } = message.member.voice;
		const player = message.client.manager.get(message.guild.id);

		if (!channel) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("You need to join a voice channel!");
            return message.channel.send(thing);
        }
        
        if (!player) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no player for this guild.");
            return message.channel.send(thing);	
        }
        
        if (channel.id !== player.voiceChannel) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`You must be in the same channel as ${client.user}`);
            return message.channel.send(thing);
        }

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }

        const emojiresume = "<:stop:784754716201451530>";

        if (!player.paused) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`${emojiresume} The player is already **resumed**.`)
                .setTimestamp()
                .setFooter(`${message.client.user.username} ~ Gang Sebelah © 2020`);
            return message.channel.send(thing);
        }

        player.pause(true);

        let thing = new MessageEmbed()
            .setDescription(`${emojiresume} **Resumed**\n[${song.title}](${song.uri})`)
            .setColor(client.color)
            .setTimestamp()
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(thing);
	
    }
}
