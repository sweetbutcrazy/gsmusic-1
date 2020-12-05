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
                .setColor("RED")
                .setDescription("You need to join a voice channel first!");
            return message.channel.send(thing);
        }

        if (channel.id !== player.voiceChannel) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(`You must be in the same channel as ${message.client.user}`);
            return message.channel.send(thing);
        }

        

        player.destroy();
        
        let thing = new MessageEmbed()
            .setColor("BLACK")
            .setDescription(`${emojiLeave} **Leave the voice channel**\nThank you for using ${message.client.user.username}!`)
            .setImage('https://media.discordapp.net/attachments/773766203914321980/773785370503806976/banner_serverr_10.png?width=960&height=422')
            .setFooter(`${message.client.user.username} ~ Gang Sebelah © 2020`);
        return message.channel.send(thing);
	
  	}
};  
    
