const { EmbedBuilder } = require("discord.js");
const { ctfAPI } = require("./ctfUtils");

const getCTF = async (
  currentTimeStartQuery,
  weight,
  format,
  restrictions,
  limit,
  id
) => {
  const data = await ctfAPI(currentTimeStartQuery, limit);
  try {
    const embeds = [];

    for (const event of data) {
      if (event.weight !== undefined && event.weight !== null) {
        if (parseFloat(weight) != 0) {
          if (parseFloat(event.weight) > parseFloat(weight)) {
            continue;
          }
        }
      }
      if (event.format !== undefined && event.format !== null) {
        const eventFormatLower = event.format.toLowerCase();
        const formatLower = format.toLowerCase();
        if (formatLower != "any" && formatLower != eventFormatLower) {
          console.log("format");
          continue;
        }
      }
      if (event.restrictions !== undefined && event.restrictions !== null) {
        const eventRestrictionsLower = event.restrictions.toLowerCase();
        const restrictionsLower = restrictions.toLowerCase();
        if (
          restrictionsLower != "any" &&
          restrictionsLower != eventRestrictionsLower
        ) {
          continue;
        }
      }
      if (event.id !== undefined && event.id !== null) {
        if (id != "any") {
          if (parseInt(event.id) != parseInt(id)) continue;
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(event.title || "Empty title")
        .setDescription(event.description || "Empty description")
        .setURL(event.url || "Empty URL")
        .addFields(
          {
            name: "Date",
            value: `${
              event.start ? new Date(event.start).toLocaleString() : "none"
            } to ${
              event.finish ? new Date(event.finish).toLocaleString() : "none"
            }`,
          },
          {
            name: "Weight",
            value: event.weight ? event.weight.toString() : "none",
          },
          {
            name: "Restrictions",
            value: event.restrictions ? event.restrictions.toString() : "none",
          },
          {
            name: "Duration",
            value: `${
              event.duration ? event.duration.days.toString() : "none"
            } days and ${
              event.duration ? event.duration.hours.toString() : "none"
            } total hours`,
          },
          {
            name: "Participants",
            value: event.participants ? event.participants.toString() : "none",
          },
          {
            name: "Format",
            value: event.format ? event.format.toString() : "none",
          },
          {
            name: "Organizers",
            value:
              event.organizers && event.organizers.length > 0
                ? event.organizers[0].name.toString()
                : "none",
          }
        );

      embeds.push(embed);
    }

    return embeds;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCTF,
};
