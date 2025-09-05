const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const fetchGitHubEvents = require('../service/githubService');
const sendEmail = require('../service/emailService.js');

router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: "error",
                message: 'Email is required'
            });
        }

        // check if this email is already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: 'Email already exists'
            });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ email }]);

        if (error) throw error;

        res.status(201).json({
            status: "success",
            message: 'Email saved successfully',
            data
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "something went wrong",
            error: error.message
        });
    }
});

router.post('/send-updates', async (req, res) => {
    try {
        const { data: users, error } = await supabase.from('users').select('email');

        if (error) throw error;

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: "error",
                message: 'No users found'
            });
        }

        const events = await fetchGitHubEvents();

        const latestEvents = events.slice(0, 5).map(e => `${e.type} - by ${e.actor.login}`).join('\n');

        for (const user of users) {
            await sendEmail(user.email, 'Latest GitHub Events', latestEvents);
        }

        res.status(200).json({
            status: "success",
            message: 'Emails sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "something went wrong",
            error: error.message
        })
    }
});


module.exports = router;
