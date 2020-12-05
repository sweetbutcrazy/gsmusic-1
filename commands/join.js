const { MessageEmbed } = require("discord.js") 

module.exports = {
    name: "join", 
    aliases: [], 
    category: "Main",
    description: "This is an join command",
    usage: "join",
    run: async function (client, command, args, message) {
		const { channel } = message.member.voice;

		if (!channel) {
            let mbd = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join voice channel!");
            return message.channel.send({embed: mbd});
        }

        

        if(!message.guild.me.voice.channel) {
            
            const player = client.manager.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                volume: 50,
                selfDeafen: true,
            });

            player.connect();

            let mbd = new MessageEmbed()
                .setColor("BLACK")
                .setAuthor("Joined the voice channel", 
                           "https://cdn.discordapp.com/emojis/780844831072321548.gif", 
                           "https://discord.gg/gangsebelah" 
                          )
                .setDescription(`<#${channel.id}> and bound to <#${message.channel.id}>`)
            	.setFooter(`${client.user.username} ~ Gang Sebelah © 2020`);
            return message.channel.send({embed: mbd});

        } else if (message.guild.me.voice.channel !== channel) {

            let mbd = new MessageEmbed()
                .setColor("RED")
                .setDescription(`You must be in the same channel as ${client.user}`);
            return message.channel.send({embed: mbd});
        }
	
  	}
};
