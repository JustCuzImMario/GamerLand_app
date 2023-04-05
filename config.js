// load environment variables
require('dotenv').config();

// set secret key
const secretKey = process.env.SECRET_KEY;

// export secret key
module.exports = secretKey;
