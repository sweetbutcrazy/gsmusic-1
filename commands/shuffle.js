const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shuffle", //neded
    aliases: [],
    category: "Main",
    description: "This is an shuffle command",
    usage: "shuffle",
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


        player.queue.shuffle();
        
        const emojishuffle = message.client.emoji.shuffle;

        let thing = new MessageEmbed()
            .setDescription(`${emojishuffle} Shuffled the queue`)
            .setColor(client.color)
            .setTimestamp()
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(thing).catch(error => message.client.logger.log(error, "error"));
	
  	}
};
 
