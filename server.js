const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const userRoutes = require('./src/routes/userRoutes.js');
require('./src/cron/cronJob.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'subscribe.html'));
})

app.use('/api', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
