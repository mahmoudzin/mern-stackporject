const dbSecure = process.env.DB_SECURE;
const DATABASE = `mongodb+srv://${dbSecure}@test.ottu2.mongodb.net/?retryWrites=true&w=majority&appName=test`;

module.exports = DATABASE;
