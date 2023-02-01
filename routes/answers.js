const express = require ('express');
const router = express.Router();
const QuestionsAndAnswers = require('../models/QuestionsAndAnswers.js')

router.put(`/:answer_id/helpful`, (req, res) => {
  var answer_id = req.params.answer_id;
  QuestionsAndAnswers.markAnswerHelpful(answer_id)
  .then((result)=> {
    res.sendStatus(204);
  })
  .catch((err) => {
    console.log(`err while marking question as helpful : ${err}`);
    throw(err)
  })
})

router.put(`/:answer_id/report`, (req, res) => {
  var answer_id = req.params.answer_id;
  QuestionsAndAnswers.reportAnswer(answer_id)
  .then((result)=> {
    res.sendStatus(204);
  })
  .catch((err) => {
    console.log(`err while reporting answer : ${err}`);
    throw(err)
  })
})


module.exports = router