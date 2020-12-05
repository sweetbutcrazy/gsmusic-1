const { MessageEmbed, version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');

module.exports = {
    name: "status", 
    aliases: ["stats"],
    category: "Main",
    description: "This is an stats command",
    usage: "stats",
    run: async function (client, command, args, message) {
        const duration1 = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const cpu = await si.cpu();
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setFooter(`${message.client.user.username} ~ Gang Sebelah © 2020`)
            .setAuthor("STATISTIC", "https://cdn.discordapp.com/emojis/588679397909987350.png", "https://discord.gg/gangsebelah") 
            .setDescription(`
**• Servers** : ${message.client.guilds.cache.size.toLocaleString()}
**• Channels** : ${message.client.channels.cache.size.toLocaleString()}
**• Users** : ${message.client.users.cache.size.toLocaleString()}
**• Discord.js** : v${version}
**• Node** : ${process.version}

**• SYSTEM :**
**• Platfrom** : \`${os.type}\`
**• Uptime** : \`${duration1}\`
**• CPU** :
> **• Cores** : \`${cpu.cores}\`
> **• Model** : \`${os.cpus()[0].model}\`
> **• Speed** : \`${os.cpus()[0].speed} MHz\`

**• MEMORY** :
> **• Total Memory** : \`${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps\`
> **• Free Memory** : \`${(os.freemem() / 1024 / 1024).toFixed(2)} Mbps\`
> **• Heap Total** : \`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps\`
> **• Heap Usage** : \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps\`
`);
        message.channel.send({embed: embed});
    }
} 
