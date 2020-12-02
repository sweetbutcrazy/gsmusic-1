const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "ping", 
    aliases: [] 
    category: "Main",
    description: "This is an ping command",
    usage: "ping",
    run: async function (client, command, args, message) { 
const embed = new MessageEmbed()
            .setColor("#D70FB6")
            .setDescription(`> Ping : ${client.ws.ping}'ms`)
            .setFooter(`${client.user.username} ~ Gang Sebelah © 2020`);
        message.channel.send(embed);
    }
} 
