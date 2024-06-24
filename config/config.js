module.exports = {

  Prefix: "!",
  Status: "production",
  Port: 3000, //Port for the website
  GuildID: "757409669634326609", //Guild ID for the discord server

  Handlers: {
    MONGO: "mongodb+srv://truf022:8214524630abc@cluster0.andtgba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" //MongoDB url
  },

  Client: { //Discord bot token and ID
    TOKEN: "MTI1NDczMjk3OTg3MjQ2OTA4NQ.Gy14Cw.3gYqi-jEIzCGNiqE1NdjU_mwjZ-NW6zGlCk-og",
    ID: "1254732979872469085"
  },

  ihu_app: { // APPS application
    CLIENT_ID: "6679465a31ae3165b0acf521",
    CLIENT_SECRET: "4gkz4frmu0qnf5re9ixvrfjie82r1iwidci5ppnjsgnx9i2dgm",
    SCOPES: "announcements,notifications,profile",
    REDIRECT_URI: "http://localhost:3000/callback"
  },

  announcements: { //Where to send all new announcements, and role ID to give to newly authenticated users
    send_all_channelID: "758296612069048331",
    log_channel: "757420149140750498"
  },
  auth_role_student: "1254733831705989201",
  auth_role_teacher: "1254856528318566481",

  contact: { //For the site's contact form. Recaptcha secret, and channelID to send the forms to
    g_secretKey: "",
    contact_form_channel: "758296612069048331"
  }

}
