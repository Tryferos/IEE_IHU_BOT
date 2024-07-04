const config = require('./config/config');

["express", "mongoose"].forEach((file) => {
    require(`./handlers/${file}`)(config);
  });
  