module.exports = {
    name: "stop",
    aliases: [],
    category: "Main",
    description: "This is an stop command",
    usage: "stop",
    run: async function (client, command, args, message) { 
    const player = message.client.manager.get(message.guild.id);
    if (!player) return message.reply({embed: {color: "#D70FB6c, description: "There is no player for this guild."}});

    const { channel } = message.member.voice;
    
    if (!channel) return message.channel.send({embed: {color: "#D70FB6", description: "You need to join a voice channel."}});
    if (channel.id !== player.voiceChannel) return message.channel.send({embed: {color: "#D70FB6", "description: `You must be in the same channel as ${client.users.username}`}});
    
    player.destroy();
    return message.channel.send({embed: {color: "#D70FB6", description: "Stopped the music.");
    }
}
