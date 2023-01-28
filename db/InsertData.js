const {Client} = require ('pg')
const client = new Client({
  database: 'questionsandanswers',
  user: 'andyma',
  password: ''

})
 client.connect()
  .then (() => console.log('connected'))
  .catch((err) => console.error(`connection error ${err.stack}`))

  const execute = async (query) => {
    try {
        await client.query(query);
        console.log(`done!`) // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};
const question = "\copy question from '/Users/andyma/Desktop/SDC_CSV/questions.csv' DELIMITER ',' CSV HEADER";
const answers = `\copy answer from '/Users/andyma/Desktop/SDC_CSV/answers.csv' DELIMITER ',' CSV HEADER`;
const photo = `\copy photo from '/Users/andyma/Desktop/SDC_CSV/answers_photos.csv' DELIMITER ',' CSV HEADER`;
const update_question_serial = "SELECT setval('question_id_seq', (SELECT MAX(id) from question))";
const update_answer_serial = "SELECT setval('answer_id_seq', (SELECT MAX(id) from answer))";
const update_photo_serial = "SELECT setval('photo_id_seq', (SELECT MAX(id) from photo))";

const allQueries = [question, answers, photo, update_answer_serial,update_answer_serial,update_photo_serial];

allQueries.reduce((p, fn) => p.then(execute(fn)), Promise.resolve());

// execute(question)
//   .then ((result) => {
//     if(result) {
//       console.log(`question data inserted`);
//     }
//     return execute(answers);
//   })
//   .then((result) => {
//     if(result) {
//       console.log(`answer data inserted`);
//     }
//     return execute(photo);
//   })
//   .then((result) => {
//     if(result) {
//       console.log(`photo data inserted`);
//     }
//     return execute(update_question_serial)
//   })
//   .then((result) => {
//     if(result) {
//       console.log(`changed max index on photos`);
//     }
//    return execute(update_answer_serial);
//   })
//   .then((result) => {
//     if(result) {
//       console.log(`changed max index on answer `);
//     }
//    return execute(update_photo_serial);
//   })
//   .then((result) => {
//     if(result) {
//      console.log(`changed max index on photos`);
//     }
//     client.end;
//   })
//   .catch((err) => {
//     console.log(`err is increating tables : ${err.stack}`);
//   })