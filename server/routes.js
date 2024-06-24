const config = require("../config/config.js");
const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const axios = require('axios');
const { Router } = require('express');
const utils = require('./utils.js');
const UserSchema = require("./models/user.js");

const router = Router();

router.get('/', async (req, res) => {
	const status = req.query.status;
	res.render('index', { status });
});

const embedUser = (role) => new EmbedBuilder()
.setColor(0x00FF00)
.setTitle('Επιτυχής σύνδεση!')
.setDescription(`Το discord σας έχει συνδεθεί επιτυχώς με τον λογαριασμό σας!\nΠλεόν μπορείται να αξιοποιείσετε όλες τις δυνατότητες του ρόλου **${role}**`);

const embedChannel = (userId) => new EmbedBuilder()
.setColor(0x00FF00)
.setTitle(`Επιτυχής αυθεντικοποίηση χρήστη!`)
.setDescription(`Ο χρήστης <@${userId}>\n Μόλις αυθεντικοποίηθηκε στο σύστημα!`)
.setTimestamp();

const embedUserSameApps = (user, existingUser) => new EmbedBuilder()
.setColor(0x00FF00)
.setTitle(`[!] Κίνδυνος BOT [!]`)
.setDescription(`Ο χρήστης <@${user}> προσπάθησε να συνδέσει τον <@${existingUser}> με το ίδιο apps account!`);

router.get('/callback', async (req, res) => {

	if (req.query.code) {
		const authCodeProof = {
			grant_type: 'authorization_code',
			client_id: config.ihu_app.CLIENT_ID,
			client_secret: config.ihu_app.CLIENT_SECRET,
			redirect_uri: config.ihu_app.REDIRECT_URI,
			code: req.query.code
		};

		// Exchange the authorization code for an access token and refresh token
		//Seperate req.query.state by comma
		const state = req.query.state.split(',');
		const userID = state[0];
		const guildID = state[1];

		const [token, eduPersonAffiliation] = await utils.exchangeForTokens(userID, authCodeProof);

		const guildUser = client.guilds.cache.get(config.GuildID).members.cache.get(userID);
		const logChannel = client.guilds.cache.get(config.GuildID).channels.cache.get(config.announcements.log_channel);
		
		if(token.sameAppsDifferentUser==true){
			logChannel.send({embeds: [embedUserSameApps(guildUser.user.id, token.existingUser)]})
			return res.redirect(`/?msg=error`);
		}

		const roleId = utils.getRoleId(eduPersonAffiliation)
		const authRole = client.guilds.cache.get(guildID).roles.cache.find(role => role.id === roleId);

		guildUser.roles.add(authRole);
		
		//If any error occurs, redirect user to the /error endpoint with the error message
		if (token.message) {
			return res.redirect(`/?msg=${token.message}`);
		}

		//send embed to user with userID, with an embed saying Succesfully connected
		const user = await client.users.fetch(userID);
		

		console.log(`User ${user.tag} has been authenticated`);

		logChannel.send({ embeds: [embedChannel(guildUser.id)] })
		user.send({ embeds: [embedUser(authRole.name)] });

		// Once the tokens have been retrieved, we are done and ready to make queries
		res.redirect(`/?status=acc_connected`);
	}
});


router.post('/contact', async (req, res) => {
	if ( req.body['catcha-res'] === undefined || req.body['catcha-res'] === null || req.body['catcha-res'] === '' ) {
	  return res.json({ responseError: 'something went wrong' });
	}

	const secretKey = config.contact.g_secretKey;

	const url =
	  `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['catcha-res']}&remoteip=${req.socket.remoteAddress}`;

	await axios.get(url)
	  .then(async (response) => {
		
		if (response.data.success !== undefined && !response.data.success) {
			return res.json({ responseError: 'Failed captcha verification' })
		}

		const { name, discord, message } = req.body;

		if (!name || !discord || !message) {
			return res.redirect(`/error?msg=Please fill in all fields`);
		}

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('New Contact Form Submission')
			.setDescription(message)
			.addFields(
				{ name: 'Name', value: name, inline: true },
				{ name: 'Discord', value: discord, inline: true },
			)
			.setTimestamp();

		await client.channels.cache.get(config.contact.contact_form_channel).send({ embeds: [embed] }).catch(console.error);

		res.json({ responseSuccess: 'Success' })
	  })
	  .catch(function (error) {
		return res.json({ responseError: 'something went wrong' })
	  })

})
  
  
router.get('/error', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.write(`<h4>Error: ${req.query.msg}</h4>`);
	res.end();
});


module.exports = router;