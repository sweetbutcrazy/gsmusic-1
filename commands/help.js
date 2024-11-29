const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "Main",
    description: "This is an help command",
    usage: "help",
    run: async function (client, command, args, message) { 
   
    var hmbd = new MessageEmbed() 
     .setColor(client.color)
     .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`, "https://discord.gg/gangsebelah") 
     .addField("Information", "`help, stats, ping`")
     .addField("Music", "`play, pause, resume, autoplay, bassboost, stop, volume, queue, shuffle, nowplaying, seek, skip, skipto, join, leave, loop, lyrics, remove, clearqueue`") 
     .setTimeStamp()
     .setFooter(`${client.user.username} ~ Gang Sebelah © 2020`)
        message.channel.send({embed: hmbd})
    }
}
