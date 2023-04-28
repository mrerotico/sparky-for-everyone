const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show the bot commands.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Bot Commands')
      .setDescription('Here are the commands available for this bot.')
      .addFields(
        {
          name: '/help',
          value: 'Show the bot commands.',
        },
        {
          name: '/guess',
          value: 'Guess the correct answer to a random question.',
        },
        {
          name: '/addlevel',
          value: 'Add a level to the bot (only <@&1094603785340473456> can)',
        },
        // Add more commands here as needed
      )

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          'There was an error while executing this command. Please try again.',
        ephemeral: true,
      });
    }
  },
};
