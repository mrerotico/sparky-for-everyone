const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
  intents: 3276799,
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
const prefix = "!";
const fs = require("fs");

function addLevel(name, imageURL) {
  const data = JSON.parse(fs.readFileSync("./Commands/Public/guess.json"));
  data.push({ name: name, imageURL: imageURL });
  fs.writeFileSync("./Commands/Public/guess.json", JSON.stringify(data));
  console.log(`Added level "${name}" to guess.json`);
}

client.snipes = new Map();
client.on("messageDelete", (message) => {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    timestamp: new Date().getTime(),
    attachment: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  });
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith("!addlevel")) {
    const args = message.content.split(" ");
    if (args.length < 3) {
      message.reply("Usage: !addlevel <name> <imageURL>");
      return;
    }
    const name = args[1];
    const imageurl = args[2];
    addLevel(name, imageurl);
    message.reply(`Level "${name}" has been added to guess.json.`);
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const messageArray = message.content.split(" ");
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  client.user.setActivity({
    name: "Xynel GDPS",
  });
});

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
loadEvents(client);
loadButtons(client);

// Anti-Crash
require("./Handlers/anti-crash.js")(client);

client.login(client.config.token);