// server.js
const express = require('express');
const app = express();
const basicRoute = require('./routes/basicRoute');
const specialRoutes = require('./routes/specialRoutes');

app.use(express.json());

// Generic CRUD
app.use('/api', basicRoute);

// Special/custom routes
app.use('/api', specialRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
