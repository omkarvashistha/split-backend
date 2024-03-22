const express = require("express");
const app = express();
const cors = require('cors');

const routes = require('./routes/mainRoutes');

app.use(cors);
app.use(express.json());
app.use('/',routes);

const port = process.env.port || 5001;

app.listen(port,()=>{
  console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;