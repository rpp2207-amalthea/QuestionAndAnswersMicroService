const express = require ('express');
const router = express.Router();
const PORT = process.env.DEV_PORT || 4206;
const questions = require('../routes/questions.js');
const answers = require('../routes/answers.js')
const app = express ();
app.use(express.json())
app.use('/qa/questions', questions);
app.use('/qa/answers', answers)


module.exports= app;