// Punto de entrada

const express = require('express');
const explorerRoutes = require('./routes/explorer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/explorer', explorerRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
