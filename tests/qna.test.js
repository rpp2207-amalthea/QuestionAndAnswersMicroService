
const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('../models/QuestionsAndAnswers.js');
const index = require('../routes/questions.js');
const express = require('express');
const app = express();
const assert = require('assert');

app.use(express.json());
app.use("/", index);

// test("index route works", done => {
//    request(app)
//     .get("/")
//     .query({id: 1, count:1})
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .then (response => {
//       expect(response, 'hello');
//       return done()
//     })
// })

describe('GET /qa/questions', () => {
  it('should respond with a JSON object', function () {
    return request(app)
      .get("/")
      .query({id: 1, count:1})
      // .expect('Content-Type', /json/)
      // .expect(200)
      .then (res => {
        console.log(`res test is equal to ${JSON.stringify(res.body.results.length)}`);
        expect(res).to.be.an('object');
        expect(res.body.results.length).to.equal(1);
      })
  })
})
// describe ('QnA routes', () => {
//   before( async() => {
//     const pool = new Pool({
//       "database": 'questionsandanswers',
//       "max" : 20,
//       "connectionTimeoutMillis": 0,
//       "idleTimeoutMillis": 0
//     });

//     client.query = (text, values) => {
//       return pool.query ( text, values)
//     }
//   });

//   beforeEach('Create temporary tables', async () => {
//     await client.query('CREATE TEMPORARY TABLE question ( LIKE question INCLUDING ALL)');
//     await client.query('CREATE TEMPORARY TABLE answer ( LIKE answer INCLUDING ALL');
//     await client.query(`INSERT INTO pg_temp.question (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES
//     (1, "this is body test", 1674939822, "andy", "andy@test.com", 0, 1)`);
//     await client.query(`INSET INTO pg_temp.answer (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES
//     (20, "TESTING QUESTION BODY", 1674939822, "andytest", "andy@test.com",0,10)`);
//   });

//   afterEach('Drop temporary tables', async () => {
//     await client.query('DROP TABLE IF EXISTS pg_temp.question');
//     await client.query('DROP TABLE IF EXISTS pg_temp.question');
//   })

//   describe('GET /questions', function () {
//     it('Should give us questions', async function () {
//       const req = {
//         id :'1'
//       }
//       const expected = {
//         id '1',
//         product_id: '1',
//         body: 'this is body test',
//         date_written: '1674939822',
//         asker_name: 'andy',
//         asker_email: 'andy@test.com',
//         reported : 'false',
//         helpful: '1'
//       }

//       const {body} = await request(app)
//       .get('')
//     })
//   })
// })


/*
  const getReview = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/dbreviews')
      .send(req)
      .expect(status);
    return body;
  };
*/