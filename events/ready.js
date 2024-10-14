const { Events } = require("discord.js");
const cron = require("node-cron");
const { checkCTF } = require("../functions/checkCTF");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    cron.schedule("0 18 * * *", () => {
      console.log("Running checkCTF...");
      checkCTF(client);
    });
  },
};
