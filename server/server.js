const express = require ('express');
const index = require('./index.js');
const PORT = process.env.DEV_PORT || 4206;
const app = express ();

app.use(express.json())
app.use('/', index)

app.listen(PORT, () => {
  console.log(`listening on PORT : ${PORT}`);
})