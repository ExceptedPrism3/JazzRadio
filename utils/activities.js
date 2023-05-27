const activitiesList = [
  { type: 'PLAYING', message: 'Saxophone' },
  { type: 'WATCHING', message: 'a Jazz Concert' },
  { type: 'LISTENING', message: 'Contemporary Jazz' },
  { type: 'LISTENING', message: 'DJ Hmida' },
  { type: 'PLAYING', message: 'Piano' },
  { type: 'WATCHING', message: 'Paris Tower' },
];

const setRandomActivity = (client) => {
  const randomActivity = activitiesList[Math.floor(Math.random() * activitiesList.length)];
  const { type, message } = randomActivity;
  client.user.setPresence({ activities: [{ type, name: message }] });
};

module.exports = { setRandomActivity };
