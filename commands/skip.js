module.exports = {
    name: "skip",
    aliases: [], 
    description: "This is an skip command", 
    usage: "skip", 
    run: async function(client, command, args, message ) { 
      const player = message.client.manager.get(message.guild.id);
      if (!player) return message.reply("there is no player for this guild.");
  
      const { channel } = message.member.voice;
      if (!channel) return message.reply("you need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return message.channel.send(`You must be in the same channel as ${client.user.username}`);

      if (!player.queue.current) return message.channel.send({embed: {color: client.color, description: "There is no music playing."}})

      const { title } = player.queue.current;

      player.stop();
      return message.channel.send({embed: {color: client.color, description: `<:skip:784656390630146109> ${title} was skipped.`}})
    }
  } 
