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
  .catch ((err) => {
    console.log(`err while getting question : ${err}`)
    throw(err)
  })
})

router.post('/', (req, res) => {
  QuestionsAndAnswers.addQuestion(req.query)
  .then ((result) => {
    console.log(`result inside post router is equal to ${result}`);
    res.send(result);
  })
  .catch((err) => {
    console.log(`err while posting question : ${err}`)
    throw(err)
  })
})

router.get('/:question_id/answers', (req, res) => {
  var question_id = req.params.question_id;
  var limit = req.query.count || 5;
  QuestionsAndAnswers.getAnswers(question_id, limit)
  .then((result) => {
    res.send(result)
  })
})

module.exports = router


/*

INSERT INTO question(product_id, body, date_written,asker_name,asker_email,reported,helpful) VALUES ( 1, 'testinggggg', (SELECT extract(epoch FROM  now())), 'andy', 'andy@test.com', false, 0);
*/