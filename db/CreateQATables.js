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

const question =
  `CREATE TABLE IF NOT EXISTS question (
    id SERIAL,
    product_id INT,
    body VARCHAR(250),
    date_written BIGINT,
    asker_name VARCHAR(250),
    asker_email VARCHAR(250),
    reported BOOLEAN,
    helpful INT,
    PRIMARY KEY(id)
  )`

const answer =
    `CREATE TABLE IF NOT EXISTS answer (
      id SERIAL,
      question_id INT,
      body VARCHAR(250),
      date_written BIGINT,
      answerer_name VARCHAR(250),
      answerer_email VARCHAR(250),
      reported BOOLEAN,
      helpful INT,
      PRIMARY KEY(id),
      FOREIGN KEY (question_id) REFERENCES question(id)
    )`
const photo =
      `CREATE TABLE IF NOT EXISTS photo (
        id SERIAL,
        answer_id INT,
        url TEXT,
        FOREIGN KEY (answer_id) REFERENCES answer(id)
      )`

const index_question_product_id = 'CREATE INDEX question_product_id_idx ON question(product_id)';
const index_question_id = 'CREATE INDEX question_id_idx ON question(id)';
const answer_question_id = 'CREATE INDEX answer_question_id_idx ON answer(question_id)';
const photo_answer_id = 'CREATE INDEX photo_answer_id_idx ON photo(answer_id)';

const allQueries = [question, answer, photo, index_question_product_id, index_question_id, answer_question_id, photo_answer_id];

allQueries.reduce((p, fn) => p.then(execute(fn)), Promise.resolve());
// execute(question)
//   .then ((result) => {
//     if(result) {
//       console.log(`question table created`);
//     }
//     return execute(answer);
//   })
//   .then((result) => {
//     if(result) {
//       console.log(`answers table created`);
//     }
//    return execute(photo);
//    })
//   .then((result) => {
//      if(result) {
//       console.log(`photo table created`);
//      }
//      return execute(index_question_product_id)
//    })

//   .then((result) => {
//     if(result) {
//      console.log(`created index for product table `);
//     }
//     return execute(answer_question_id)
//   })
//   .then((result) => {
//     if(result) {
//      console.log(`created index for answer_question_id`);
//     }
//     return execute(photo_answer_id)
//   })
//   .then((result) => {
//     if(result) {
//      console.log(`created index for photo_answer id`);
//     }
//     client.end;
//   })
//   .catch((err) => {
//     console.log(`err is increating tables : ${err.stack}`);
//   })