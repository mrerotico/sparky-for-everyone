const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guess = require("../Public/guess.json");
const fs = require("fs");

const activeUsers = new Set();
let puntos = {};

if (fs.existsSync("./points.json")) {
  puntos = JSON.parse(fs.readFileSync("./points.json"));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Guess the name of the character'),
  async execute(interaction) {
    const usuario = interaction.user.id;

    if (activeUsers.has(usuario)) {
      return interaction.reply("You already have an active game.");
    }

    activeUsers.add(usuario);

    const index = Math.floor(Math.random() * guess.length);
    const name = guess[index].name;

    console.log("name:", name);

    if (!name || !guess[index].image) {
      return interaction.reply("There was an error trying to get image name.");
    }

    let embed = new EmbedBuilder()
      .setTitle(`Guess`)
      .setImage(guess[index].image);

    await interaction.reply({ embeds: [embed] });

    const collector = interaction.channel.createMessageCollector({
      filter: msg => msg.author.id === usuario,
      time: 80000,
      max: 1,
    });

    collector.on('collect', msg => {
      const respuesta = msg.content.trim().toLowerCase();

      if (respuesta === name.toLowerCase()) {
        let aciertos = puntos[usuario] || 0;
        aciertos++;
        puntos[usuario] = aciertos;

        fs.writeFile("./points.json", JSON.stringify(puntos), (err) => {
          if (err) throw err;
          console.log('Points saved to points.json');
        });

        interaction.followUp(`🎉 Congratulations! You guessed it correctly! 🎉`);
      } else {
        interaction.followUp(`❌ Incorrect! Try again next time! ❌`);
      }
    });

    collector.on('end', collected => {
      activeUsers.delete(usuario);

      if (collected.size === 0) {
        interaction.followUp({ content: "Time's up!", ephemeral: true });
      }
    });
  }
};