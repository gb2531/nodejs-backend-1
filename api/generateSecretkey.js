const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const secretKey = crypto.randomBytes(64).toString('hex');

const envFilePath = path.join('./../api', '.env');
const envFileContent = `JWT_SECRET=${secretKey}\n`;

fs.writeFileSync(envFilePath, envFileContent);

console.log(`Secret key generated and saved to ${envFilePath}`);