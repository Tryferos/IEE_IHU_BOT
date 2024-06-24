require('dotenv').config()

module.exports = {

  Prefix: "!",
  Status: process.env.STATUS,
  Port: process.env.PORT, //Port for the website
  GuildID: process.env.GUILD_ID, //Guild ID for the discord server

  Handlers: {
    MONGO: process.env.MONGO_URL //MongoDB url
  },

  Client: { //Discord bot token and ID
    TOKEN: process.env.DISCORD_TOKEN,
    ID: process.env.DISCORD_CLIENT_ID
  },

  ihu_app: { // APPS application
    CLIENT_ID: process.env.APPS_CLIENT_ID,
    CLIENT_SECRET: process.env.APPS_CLIENT_SECRET,
    SCOPES: process.env.APPS_SCOPES,
    REDIRECT_URI: process.env.APPS_REDIRECT_URI
  },

  announcements: { //Where to send all new announcements, and role ID to give to newly authenticated users
    send_all_channelID: process.env.LOG_CHANNEL,
    log_channel: process.env.LOG_CHANNEL,
  },
  auth_role_student: process.env.AUTH_ROLE_STUDENT,
  auth_role_teacher: process.env.AUTH_ROLE_TEACHER,

  contact: { //For the site's contact form. Recaptcha secret, and channelID to send the forms to
    g_secretKey: "",
    contact_form_channel: process.env.LOG_CHANNEL
  }

}
