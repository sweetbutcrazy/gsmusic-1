const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "autoplay",
    aliases: ["ap" ],
    category: "Main",
    description: "This is an autoplay command",
    usage: "autoplay" ,
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

        const autoplay = player.get("autoplay");

        const emojireplay = "<:autoplay:784747511435886652>";

        if (autoplay === false) {
            const identifier = player.queue.current.identifier;
            player.set("autoplay", true);
            player.set("requester", message.author);
            player.set("identifier", identifier);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            res = await player.search(search, message.author);
            player.queue.add(res.tracks[1]);
            let thing = new MessageEmbed()
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **enabled**`)
                .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(thing);
        } else {
            player.set("autoplay", false);
            player.queue.clear();
            let thing = new MessageEmbed()
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **disabled**`)
                .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(thing);
        }

    }
};
    
