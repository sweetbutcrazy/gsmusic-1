const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skipto", //neded
    aliases: ["jump" ],
    category: "Main",
    description: "This is an example command",
    usage: "skipto" ,
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


        const position = Number(args[0]);
		
		if (!position || position < 0 || position > player.queue.size) { 
			let thing = new MessageEmbed()
                .setColor(client.color)
				.setDescription(`Usage: ${message.client.prefix}volume <Number of song in queue>`)
            return message.channel.send(thing);
		}

        player.queue.remove(0, position - 1);
        player.stop();
		
		const emojijump = "<:remove:784748892109275196>";

		let thing = new MessageEmbed()
			.setDescription(`${emojijump} Forward **${position}** Songs`)
			.setColor(client.color)
			.setTimestamp()
			.setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
		return message.channel.send(thing);
	
  	}
};
