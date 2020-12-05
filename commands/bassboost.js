const levels = {
  off: 0.0,
  low: 0.10,
  medium: 0.15,
  high: 0.25,
  extreme: 0.60
};

module.exports = {
    name: "bassboost", 
    aliases: ["bb", "bass"],
    category: "Main",
    description: "This is an bassboost command",
    usage: "bassboost [off|low|high|medium]",
    run: async function (client, command, args, message) { 
     if(!args[0]) return message.channel.send({embed: {color: client.color, description: "**usage:\n n.bassboost off \nn.bassboost low \nn.bassboost medium \nn.bassboost high \nn.bassboost extreme**"}}) 
        const player = message.client.manager.get(message.guild.id);
    if (!player) return message.channel.send({embed: {color: client.color, description: "There is no player for this guild"}});

    const { channel } = message.member.voice;
    
    if (!channel) return message.channel.send({embed: {color: client.color, description: "You need to join a voice channel."}});
    if (channel.id !== player.voiceChannel) return message.channel.send({embed: {color: client.color, description: `You must be in the same channel as ${client.user.username}`}});

    let level = "off";
    if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

    const bands = new Array(3)
      .fill(null)
      .map((_, i) =>
        ({ band: i, gain: levels[level] })
      );

    player.setEQ(...bands);

    return message.channel.send({embed: {color: client.color, description: `Set the bassboost level to ${level}`}});
  
    }
}
