const { EmbedBuilder } = require("discord.js");
const User = require('../../../server/models/user.js');
const config = require('../../../config/config.js');
const chalk = require('chalk');

const STATS_CACHE = {
    last_updated: Date.now(),
    stats: null,
}
const DATE_OFFSET = 300000;
module.exports = {
    name: "statistics",
    description: "Δές μερικά στατιστικά των εγγεγραμμένων χρηστών",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",

    },
    run: async (client, interaction, config, guild) => {
		console.log(chalk.yellow(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`));

		if (!interaction.guild) {
			return interaction.reply({ content: `Αυτή η εντολή δεν είναι διαθέσιμη σε προσωπικά μηνύματα.`, ephemeral: true });
        }

        const isAuthorized = await User.findOne({userId: interaction.user.id})
        if(!isAuthorized){
            return interaction.reply({ content: `Αυτή η εντολή δεν είναι διαθέσιμη στους μη εγγεγραμμένους χρήστες.`, ephemeral: true });
        }

		const canFetch = (Date.now() - STATS_CACHE.last_updated) > DATE_OFFSET
        
        if(canFetch || STATS_CACHE.stats==null){
            const users = await User.find({})
            const stats = new Map();
            users.forEach((user) => {
                const length = stats.get(user.regyear);
                stats.set(user.regyear, (length ?? 0) + 1);
            })
            STATS_CACHE.stats = Array.from(Array.from(stats).sort((a,b) => b[1]-a[1]).map(([key, value]) => ({year: key, total: value})));
            STATS_CACHE.last_updated = Date.now();
        }else{
            console.log('Using cache to retrieve Statistics')
        }

        if(STATS_CACHE.stats.length==0 || STATS_CACHE.stats==null){
            return interaction.reply({content: '**Δεν υπάρχουν ακόμα εγγεγραμμένοι χρήστες**', ephemeral: true})
        }

        const totalStudents = STATS_CACHE.stats.reduce((prev, cur, i) => prev+cur.total, 0);

        const stringStats = STATS_CACHE.stats.map((stats) => `Το έτος **${stats.year}** εισήχθησαν **${stats.total}** φοιτητές`).join('\n')

        interaction.reply({content: `__**Τα Στατιστικά του server**__\n\n${stringStats}\n\nΣυνολικές εγγραφές **${totalStudents} φοιτητές!**`, ephemeral: true})

    },
};
