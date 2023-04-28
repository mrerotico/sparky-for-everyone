const fs = require('fs');

module.exports.loadEvents = async (client) => {
  const eventFiles = fs
    .readdirSync('./Events')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../Events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  const commandFiles = fs
    .readdirSync('./Commands')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../Commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Events", "Status");

  await client.events.clear();

  const Files = await loadFiles("Events");

  Files.forEach((file) => {
    const event = require(file);

    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.rest) {
      if (event.once) client.rest.on(event.name, execute);
      else client.rest.on(event.name, execute);
    } else {
      if (event.once) client.once(event.name, execute);
      else client.on(event.name, execute);
    }

    table.addRow(event.name, "🟩");
  });

  console.log(table.toString(), "\nLoaded Events.");
};