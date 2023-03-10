const express = require ('express');
const router = express.Router();
const QuestionsAndAnswers = require('../models/QuestionsAndAnswers.js')

router.get('/', (req,res,next) => {
  //console.log(`req.body is equal to ${JSON.stringify(req.query)}`)
  var product_id = req.query.product_id;
  var limit = req.query.count || 5;
  QuestionsAndAnswers.getQuestions(product_id,limit)
  .then ((result) => {
    //console.log(JSON.stringify(result));
    res.send(result);
  })
  .catch ((err) => {
    console.log(`err while getting question : ${err}`)
    //throw(err)
    next(err)
  })
})

router.post('/', (req, res,next) => {
  console.log(`req.body is equal to ${JSON.stringify(req.body)}`)
  QuestionsAndAnswers.addQuestion(req.body)
  .then ((result) => {
    res.status(201)
    res.send(result);
  })
  .catch((err) => {
    console.log(`err while posting question : ${err}`)
    next(err)
  })
})

router.get('/:question_id/answers', (req, res, next) => {
  var question_id = req.params.question_id;
  var limit = req.query.count || 5;
  QuestionsAndAnswers.getAnswers(question_id, limit)
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(`err while getting answers : ${err}`)
    next(err)
  })
})

router.post('/:question_id/answers', (req, res, next) => {
  var question_id = Number(req.params.question_id);
  console.log(`question id to post answer is equal to ${JSON.stringify(req.params)}`)
  QuestionsAndAnswers.addAnswer(question_id, req.body)
  .then((result) => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.log(`err while posting answer : ${err}`)
    next(err)
  })
})

router.put(`/:question_id/helpful`, (req, res) => {
  var question_id = req.params.question_id;
  QuestionsAndAnswers.markQuestionHelpful(question_id)
  .then((result)=> {
    res.sendStatus(204);
  })
  .catch((err) => {
    console.log(`err while marking question as helpful : ${err}`);
    throw(err)
  })
})

router.put(`/:question_id/report`, (req, res,next ) => {
  var question_id = req.params.question_id;
  QuestionsAndAnswers.reportQuestion(question_id)
  .then((result)=> {
    res.sendStatus(204);
  })
  .catch((err) => {
    console.log(`err while reporting question as helpful : ${err}`);
    next(err)
  })
})

module.exports = router


/*

INSERT INTO question(product_id, body, date_written,asker_name,asker_email,reported,helpful) VALUES ( 1, 'testinggggg', (SELECT extract(epoch FROM  now())), 'andy', 'andy@test.com', false, 0);
*/