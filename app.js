const express = require("express");
const app = express();

const routes = require('./routes/mainRoutes');

app.use(express.json());
app.use('/',routes);

const port = process.env.PORT || 5001;

app.listen(port,()=>{
  console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;