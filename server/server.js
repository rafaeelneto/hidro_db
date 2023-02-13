const dotenv = require('dotenv');
dotenv.config();

const server = require('./app');

//Initialize the server on the enviroment port
server.listen(process.env.PORT || 8081, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
