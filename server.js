/* Global Requires */

const express    = require('express');
const path       = require('path');
const app        = express();


if(process.env.NODE_ENV === 'development') {
  console.log('in development.');
  require('dotenv').config();
} else {
  console.log('in production.');
}

/* App Config */
app.use(express.static(path.join(__dirname, 'build')));
/* Server Initialization */
app.get('/', (req, res) => res.sendFile('index.html'));
var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server initialized on // ${new Date()}`));

//new configs//
