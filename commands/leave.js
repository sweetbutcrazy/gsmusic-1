const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "leave", //neded
    aliases: ["dc"],
    category: "Main",
    description: "This is an leave command",
    usage: "leave",
    run: async function (client, command, args, message) { //needed
      const { channel } = message.member.voice;
        const player = message.client.manager.get(message.guild.id);

		if (!channel) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription("You need to join a voice channel!");
            return message.channel.send(thing);
        }

        if (channel.id !== player.voiceChannel) {
            let thing = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`You must be in the same channel as ${client.user}`);
            return message.channel.send(thing);
        }

        

        player.destroy();
        
         const mbd = new MessageEmbed()
      .setColor(client.color)
      .setAuthor(
        "Good Bye... im leaving the channel.",
        "https://cdn.discordapp.com/emojis/780091765696888852.gif",
        "https://discord.gg/gangsebelah")
      .setDescription(`Thanks for using **${client.user.username}**`)
      .setImage(`https://cdn.discordapp.com/attachments/773766203914321980/782599730215518228/banner_server_15.png?width=960&height=422`)
      .setFooter(`${client.user.username} ~ Gang Sebelah © 2020`);
        return message.channel.send(mbd);
	
  	}
};  
    
