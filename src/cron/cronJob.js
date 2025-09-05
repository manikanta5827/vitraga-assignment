const cron = require('node-cron');
const supabase = require('../config/supabase.js');
const { fetchGitHubEvents } = require('../service/githubService.js');
const { sendEmail } = require('../service/emailService.js');


cron.schedule('* 9 * * *', async () => {
  console.log('cron job triggered on', new Date());
  try {
    const { data: users, error } = await supabase.from('users').select('email');

    if (error) throw error;

    if (!users || users.length === 0) {
      return;
    }

    const events = await fetchGitHubEvents();

    const latestEvents = events.slice(0, 5).map(e => `${e.type} - by ${e.actor.login}`).join('\n');

    for (const user of users) {
      await sendEmail(user.email, 'Latest GitHub Events', latestEvents);
    }
    console.log('Email job completed successfully');
  } catch (error) {
    console.error('Email job failed:', error.message);
  }
});
