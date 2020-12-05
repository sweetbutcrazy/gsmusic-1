const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue", 
    aliases: ["q"],
    category: "Main",
    description: "This is an example command",
    usage: "queue",
    run: async function (client, command, args, message) { 
     const player = message.client.manager.get(message.guild.id);
    if (!player) return message.channel.send({embed: {color: client.color, description: "There is no player for this guild."}});

    const queue = player.queue;
    const embed = new MessageEmbed()
      .setColor(client.color)
      .setAuthor(`Queue for ${message.guild.name}`)

    // change for the amount of tracks per page
    const multiple = 10;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current) embed.addField("Now playing", `[${queue.current.title}](${queue.current.uri})`);

    if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
    else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

    return message.channel.send({embed: embed});
    }
}
