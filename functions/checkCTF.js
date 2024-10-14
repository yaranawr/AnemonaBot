const { getCTF } = require("./getCTF");
const { ctfDefault, ctfAPI } = require("./ctfUtils");

const checkCTF = async (client) => {
  var currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  var futureDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  var timestampDate = Math.floor(futureDate / 1000);

  const data = await ctfAPI(timestampDate, 20);

  const promises = data.map(async (ctf) => {
    const ctfStartDate = new Date(ctf.start);
    const ctfStartDateOnly = new Date(
      ctfStartDate.getFullYear(),
      ctfStartDate.getMonth(),
      ctfStartDate.getDate(),
      0,
      0,
      0,
      0
    );
    const futureDateOnly = new Date(
      futureDate.getFullYear(),
      futureDate.getMonth(),
      futureDate.getDate(),
      0,
      0,
      0,
      0
    );

    if (ctfStartDateOnly.getTime() === futureDateOnly.getTime()) {
      const upcomingCTFs = await getCTF(
        timestampDate,
        ctfDefault.weight,
        ctfDefault.format,
        ctfDefault.restrictions,
        20,
        ctf.id
      );
      if (upcomingCTFs && upcomingCTFs.length > 0) {
        return upcomingCTFs;
      }
    }
  });

  const embedCTFsArray = await Promise.all(promises);
  const embedCTFs = embedCTFsArray.flat().filter(Boolean);

  if (embedCTFs.length === 0) {
    console.log("There are no CTFs scheduled to occur exactly in 5 days.");
    return;
  }

  client.guilds.cache.forEach((guild) => {
    const channel = guild.channels.cache
      .filter(
        (c) =>
          c.type === 0 && c.permissionsFor(guild.members.me).has("SendMessages")
      )
      .sort((a, b) => a.position - b.position)
      .first();
    if (channel) {
      channel
        .send({
          content: "There are CTFs scheduled for 5 days!",
          embeds: embedCTFs,
        })
        .catch((error) => {
          console.error(
            `Error sending message to channel ${channel.name} in guild ${guild.name}: ${error}`
          );
        });
    } else {
      console.log(`No suitable channel found in guild ${guild.name}.`);
    }
  });
};

module.exports = {
  checkCTF,
};
