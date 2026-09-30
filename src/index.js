require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Servernya jalan coy: http://localhost:${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/loans`);
  console.log(`====================================================`);
});
