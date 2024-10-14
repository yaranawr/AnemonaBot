const { SlashCommandBuilder } = require("discord.js");
const { getCTF } = require("../../functions/getCTF");
const { ctfDefault } = require("../../functions/ctfUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Show upcoming CTFs")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date in format YYYY/MM/DD")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("format")
        .setDescription(
          "Choose between jeopardy, attack-defense, and hack-quest"
        )
        .setRequired(false)
        .addChoices(
          { name: "Jeopardy", value: "Jeopardy" },
          { name: "Attack-Defense", value: "Attack-Defense" },
          { name: "Hack-Quest", value: "Hack-Quest" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("restrictions")
        .setDescription(
          "Choose between open, prequalified, academic, high-school, invite only, and individual"
        )
        .setRequired(false)
        .addChoices(
          { name: "Open", value: "Open" },
          { name: "Prequalified", value: "Prequalified" },
          { name: "Academic", value: "Academic" },
          { name: "High-School", value: "High-School" },
          { name: "Invite Only", value: "Invite Only" },
          { name: "Individual", value: "Individual" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("weight")
        .setDescription("Max weight. 0 to show all (default)")
        .setRequired(false)
    ),
  async execute(interaction) {
    var date = interaction.options.getString("date");
    if (!date) {
      date = Math.floor(new Date().getTime() / 1000);
    } else {
      newDate = date;
      date = Math.round(new Date(newDate).getTime() / 1000);
    }
    var weight = interaction.options.getNumber("weight");
    if (!weight) {
      if (weight < 0) {
        weight = ctfDefault.weight;
      }
      weight = ctfDefault.weight;
    }
    var format = interaction.options.getString("format");
    if (!format) {
      format = ctfDefault.format;
    }
    var restrictions = interaction.options.getString("restrictions");
    if (!restrictions) {
      restrictions = ctfDefault.restrictions;
    }

    var id = ctfDefault.id;

    const upcomingCTFs = await getCTF(
      date,
      weight,
      format,
      restrictions,
      5,
      id
    );
    if (upcomingCTFs.length === 0) {
      await interaction.reply("No matching events.");
    } else {
      await interaction.reply({ embeds: upcomingCTFs });
    }
    return;
  },
};
