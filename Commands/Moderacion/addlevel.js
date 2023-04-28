const fs = require('fs');

function addlevel(nombre, urlimagen) {
  const newLevel = {
    name: nombre,
    image: urlimagen
  };

  let data = fs.readFileSync('Commands/Public/guess.json');
  let levels = JSON.parse(data);
  levels.push(newLevel);
  let newData = JSON.stringify(levels, null, 2);
  fs.writeFileSync('Commands/Public/guess.json', newData);
}

module.exports = addlevel;


const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addlevel')
    .setDescription('Add a level')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the level')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('imageurl')
        .setDescription('URL of the image')
        .setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const imageurl = interaction.options.getString('imageurl');

    if (!name || !imageurl) {
      return interaction.reply('usage: /addlevel <name> <image URL>');
    }

    // Verificar si el usuario que ejecuta el comando tiene el rol permitido
    if (!interaction.member.roles.cache.has('1094603785340473456', '1093854209239154718')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    addlevel(name, imageurl);
    await interaction.reply(`The level "${name}" has been added to guess.json.`);
  },
};