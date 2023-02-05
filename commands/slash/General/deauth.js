const { EmbedBuilder } = require("discord.js");
const User = require('../../../server/models/user');
const config = require('../../../config/config.js');

module.exports = {
    name: "deauth",
    description: "Αφαίρα τον λογαριασμό σου από το σύστημα.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, guild) => {
		console.log(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`);

		const userID = interaction.user.id; 

		//Check if user exists in DB
		await User.findOne({ userId: userID }).then(async (user) => {
			if (user) {
				//User exists in DB
				await user.deleteOne();
				const embed = new EmbedBuilder()
					.setTitle("Goodbye 😥")
					.setDescription(`Ο λογαριασμός σας αφαιρέθηκε από το σύστημα. Αν θέλετε να συνδεθείτε ξανά, πατήστε το /auth`)
					.setColor("Random")
				interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				//User does not exist in DB
				const embed = new EmbedBuilder()
					.setTitle("404? 😕")
					.setDescription(`Δεν υπάρχεις στο σύστημα.\nΑν θες να συνδεθείς, πατήστε το /auth`)
					.setColor("Random")
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}).catch((err) => {
			console.log(err);
			interaction.reply({ content: `Υπήρξε κάποιο πρόβλημα στην επικοινωνία με την βάση δεδομένων.`, ephemeral: true });
		});


    },
};
