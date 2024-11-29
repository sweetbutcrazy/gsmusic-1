const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "clearqueue", //neded
    aliases: ["cq", "clear"],
    category: "Main",
    description: "This is an clearqueue command",
    usage: "clearqueue",
    run: async function (client, command, args, message) { //needed
        const { channel } = message.member.voice;
		const player = message.client.manager.get(message.guild.id);

		if (!channel) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("You need to join a voice channel! ");
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

		player.queue.clear();

		const emojieject = "<:remove:784748892109275196>";

		let thing = new MessageEmbed()
			.setColor(client.color)
			.setTimestamp()
			.setDescription(`${emojieject} Removed all songs from the queue`)
			.setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
	  return message.channel.send(thing);
	
  	}
};
    }
}
