module.exports = {
    name: "volume", 
    aliases: ["v"],
    category: "Main",
    description: "This is an volume command.",
    usage: "volume 1-100",
    run: async function (client, command, args, message) {
      const player = message.client.manager.get(message.guild.id);

    if (!player) return message.channel.send({embed: {color: client.color, description: "There is no player for this guild."}});
    if (!args.length) return message.channel.send({embed: {color: client.color, description: `<:volume:784704032064274432> The player volume is \`${player.volume}\`.`}})

    const { channel } = message.member.voice;
    
    if (!channel) return message.channel.send({embed: {color: client.color, description: "You need to join a voice channel."}});
    if (channel.id !== player.voiceChannel) return message.channel.send({embed: {color: client.color, description: `You must be in the same voice channel as ${client.user.username}`}});

    const volume = Number(args[0]);
    
    if (!volume || volume < 1 || volume > 100) return message.channel.send({embed: {color: client.color, description: "You need to give me a volume between 1 and 100."}});

    player.setVolume(volume);
    return message.channel.send({embed: {color: client.color, description: `<:volume:784704032064274432> Set the player volume to \`${volume}\`.`}});
 
    }
}
