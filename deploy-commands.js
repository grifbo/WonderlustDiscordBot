const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const token = process.env['DISCORD_BOT_ID'];
const fs = require('node:fs');
const path = require('node:path');
const prompt = require('prompt-sync')();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    //ask if this is the test or public verison
    let torp = prompt("Is this for the prodution env? y for yes, n for no: ");
    torp = torp.toLowerCase();

    //production env
    if (torp == "y") {
      //delete commands
      rest.put(Routes.applicationCommands(clientId), { body: [] })
      	.then(() => console.log('Successfully deleted all application commands.'))
      	.catch(console.error);

       rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
      	.then(() => console.log('Successfully deleted all guild commands.'))
      	.catch(console.error);

      //add new ones
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands for production env.`);
    }
    //test env
    else {
      //delete commands
      rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
      	.then(() => console.log('Successfully deleted all guild commands.'))
      	.catch(console.error);

      //add new ones
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands for test env.`);
    }
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
  
})();