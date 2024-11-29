module.exports = async (client, guild) => {
	client.users.fetch("573319705062932500").then(user => {
        user.send(`🔔 Leaved: ${guild.name} (${guild.id}) - ${guild.members.cache.size} members`);
	})
}