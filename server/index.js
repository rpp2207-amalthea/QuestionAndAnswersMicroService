const express = require ('express');
const router = express.Router();
const PORT = process.env.DEV_PORT || 4206;
const questions = require('../routes/questions.js');
const app = express ();
app.use('/qa/questions', questions);

app.listen(PORT, () => {
  console.log(`listening on PORT : ${PORT}`);
})