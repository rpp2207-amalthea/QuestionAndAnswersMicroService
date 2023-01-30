const express = require ('express');
const router = express.Router();
const QuestionsAndAnswers = require('../models/QuestionsAndAnswers.js')

router.get('/', (req,res) => {
  var product_id = req.query.id;
  var limit = req.query.count || 5;
  console.log(`limit is equal to ${limit}`);
  QuestionsAndAnswers.getQuestions(product_id,limit)
  .then ((result) => {
    console.log(JSON.stringify(result));
    res.send(result);
  })
})

router.post('/')
router.get('/:question_id/answers', (req,res) => {
  res.send('question answers!')
})

module.exports = router