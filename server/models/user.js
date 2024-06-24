const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	guild_id: Number, //Discord serverID
	userId: String, //discord userID
	appsId: String,
	regyear: String,
	role: String,
	refreshToken: String,
	accessToken: String,
	expiresAt: Date,
	tags: Array,
});

module.exports = mongoose.model("User", userSchema);