module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(`Logged in as ${client.user.username}`);
    console.log('====================================')

    const activities_list = [
      { type: 'PLAYING',  message: 'Saxophone' }, // This is duplicated due to the Math Library and it's how it's implemented not starting from 0
      { type: 'PLAYING',  message: 'Saxophone' },
      { type: 'WATCHING', message: 'a Jazz Concert' },
      { type: 'LISTENING', message: 'Contemporary Jazz' },
      { type: 'LISTENING', message: 'DJ Hmida' }
    ];
    
    setInterval(() => {

        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
  
        client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });

    }, 1000 * 60 * 5); // Cycle every 5 minutes
  },
};
