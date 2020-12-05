const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "loop", //neded
    aliases: [],
    category: "Main",
    description: "This is an example command",
    usage: "!example",
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
		
		const emojiloop = "<:loop:784759554696151040>" ;

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
			let thing = new MessageEmbed()
				.setColor(client.color) 
				.setTimestamp()
				.setDescription(`${emojiloop} Loop queue is now **${queueRepeat}**`)
				.setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
	        return message.channel.send(thing);
        }
      
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
		let thing = new MessageEmbed()
			.setColor(client.color)
			.setTimestamp()
			.setDescription(`${emojiloop} Loop track is now **${trackRepeat}**`)
			.setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
	    return message.channel.send(thing);
  	}
};
