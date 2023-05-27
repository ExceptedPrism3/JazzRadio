const { setRandomActivity } = require('../utils/activities'); // Require the activity file from the utils folder
const { setupCommands } = require('../utils/commandSetup'); // Require the commandSetup file

module.exports = {
    name: 'ready',
    once: true,
    execute: (client) => {
      console.log(`Logged in as ${client.user.tag}!`);
      console.log('================================');

      // Activity cycling
      setRandomActivity(client); // Call the setRandomActivity function

      setInterval(() => {
        setRandomActivity(client); // Call the setRandomActivity function every 30 seconds
      }, 30000);

      // Register command setup
      setupCommands(client);

    },
  };
  