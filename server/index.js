const express = require ('express');
const router = express.Router();
const PORT = process.env.DEV_PORT || 4206;
const questions = require('../routes/questions.js');
const answers = require('../routes/answers.js')
const app = express ();

app.use('/qa/questions', questions);
app.use('/qa/answers', answers)
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send('err.stack')
})

module.exports= app;