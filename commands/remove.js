const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove", //neded
    aliases: [],
    category: "Main",
    description: "This is an remove command",
    usage: "remove",
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

        const position = (Number(args[0]) - 1);
        if (position > player.queue.size) {
            const number = (position + 1);
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return message.channel.send(thing);
        }

		const song = player.queue.remove(position);

		const emojieject = "<:remove:784748892109275196>";

		let thing = new MessageEmbed()
			.setColor(client.color)
			.setTimestamp()
			.setDescription(`${emojieject} Removed\n[${song.track.title}](${song.track.uri})`)
			.setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
	  return message.channel.send(thing);
	
  	}
};
