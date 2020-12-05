const { MessageEmbed } = require("discord.js");
const duration = require("humanize-duration");
const ms = require("ms")

module.exports = {
    name: "seek", //neded
    aliases: [],
    category: "Main",
    description: "This is an seek command",
    usage: "seek",
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
                .setDescription(`You must be in the same channel as ${message.client.user}`);
            return message.channel.send(thing);
        }

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }

        const time = ms(args[0])
        const position = player.position;
        const duration = player.queue.current.duration;

        const emojiforward = "<:forward:784757386542841856>";
        const emojirewind = "<:skip:784656390630146109>";

        const song = player.queue.current;
        
        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new MessageEmbed()
                    .setDescription(`${emojiforward} **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor("BLACK")
                    .setTimestamp()
                    .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(thing);
            } else {
                player.seek(time);
                let thing = new MessageEmbed()
                    .setDescription(`${emojirewind} **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor("BLACK")
                    .setTimestamp()
                    .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(thing);
            }
        } else {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${client.dura}\``);
            return message.channel.send(thing);
        }
	
  	}
};
    
