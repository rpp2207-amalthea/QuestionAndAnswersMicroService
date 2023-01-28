const express = require('express');
const QuestionsAndAnswers = require('../models/QuestionsAndAnswers.js')
const app = express ();
const PORT = process.env.DEV_PORT || 4206;

app.use(express.json())

/*** List Questions */
app.get('/qa/questions', (req,res) => {
  var product_id = req.query.id;
  var limit = req.query.count || 5;
  QuestionsAndAnswers.getQuestions(product_id,limit)
  .then ((result) => {
    console.log(JSON.stringify(result));
    res.send(result);
  })
})
/*** Answers List */
app.get('/qa/questions/:question_id/answers', (req, res) => {
  var question_id = req.params.question_id;
  var limit = req.query.count || 5;
})

/*** Add a Question */
app.post('/qa/questions', (req,res) => {
  console.log(req.body.id);

  /**req.body will have body, name, email, and integer product_id **/
})

/*** Add an Answer */
app.post('/qa/questions/:question_id/answers', (req, res) => {
  var question_id = req.params.question_id;
  var newAnswer = req.body;
  console.log(question_id)
  /** req.body will have body, name, email, and an array of photos */
})

/*** Mark Question as Helpful */
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  var question_id = req.params.question_id;
  console.log(question_id)
})

/*** Report Question */
app.put('/qa/questions/:question_id/report', (req, res) => {
  var question_id = req.params.question_id;
})

/*** Report Answer */
app.put('/qa/answers/:answer_id/report', (req, res) => {
  var answer_id = req.params.answer_id;
})
app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});