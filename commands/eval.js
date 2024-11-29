const snek = require("node-superfetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "eval", //neded
  aliases: ["e"],
  category: "Main",
  description: "This is an example command",
  usage: "eval [code] ¡",
  run: async function(client, command, args, message) {
    //needed
    if (message.author.id !== client.config.owner) return;

    const embed = new MessageEmbed()
      .setColor("BLACK")
      .addField("Input", "```js\n" + args.join(" ") + "```");

    try {
      const code = args.join(" ");
      if (!code) return message.channel.send("r u kidding") 
      let evaled;
      if (code.includes(`token`)) {
        evaled = "https://xvideos.com/"
      } else {
        evaled = eval(code);
      }

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth: 0 });

      let output = clean(evaled);
      if (output.length > 1024) {
        const { body } = await snek
          .post("https://www.hastebin.com/documents")
          .send(output);
        embed.addField("Output", `https://www.hastebin.com/${body.key}.js`);
      } else {
        embed.addField("Output", "```js\n" + output + "```");
      }
      message.channel.send(embed);
    } catch (e) {
      let error = clean(e);
      if (error.length > 1024) {
        const { body } = await snek
          .post("https://www.hastebin.com/documents")
          .send(error);
        embed.addField("Error", `https://www.hastebin.com/${body.key}.js`);
      } else {
        embed.addField("Error", "```js\n" + error + "```");
      }
      message.channel.send(embed);
    }
  }
};

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

exports.clean = text => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};
