const { Pool } = require('pg');

const pool = new Pool({
  "database": 'questionsandanswers',
  "max" : 20,
  "connectionTimeoutMillis": 0,
  "idleTimeoutMillis": 0
});

const getQuestionsQuery = (product_id, limit) => {

  var stringifiedID = "'"+product_id+"'";
  return (
    `SELECT json_build_object (
      'product_id',${stringifiedID},
      'results', (
         SELECT json_agg (
          json_build_object (
            'question id', id,
            'question_body', body,
            'question_date', ( SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
            'asker_name', asker_name,
            'question_helpfulness', helpful,
            'reported', reported,
            'answers',(
              SELECT coalesce ( json_object_agg(
                id,(
                  SELECT json_build_object(
                    'id',id,
                    'body', body,
                    'date', ( SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
                    'answerer_name',answerer_name,
                    'helpfulness',helpful,
                    'photos',(SELECT coalesce (json_agg(url), '[]'::json) FROM photo WHERE photo.answer_id = answer.id)
                  )
                )
              ), '{}'::json )FROM (SELECT * FROM ANSWER WHERE answer.question_id = question.id) AS answer
            )
          )
         ) FROM (SELECT * FROM question WHERE product_id = ${Number(product_id)} limit ${Number(limit)}) AS question
      )
    )`
  )
};

const postQuestionsQuery = async (newQuestion) => {
  return (
    pool.connect().then((client) => {
      return client
      .query (`INSERT INTO question(product_id, body, date_written,asker_name,asker_email,reported,helpful)
      VALUES ( $1, $2, (SELECT extract(epoch FROM  now()) * 1000), $3, $4, false, 0) RETURNING id`, [newQuestion.id, newQuestion.body, newQuestion.name, newQuestion.email])
      .then ((result) => {
        return result;
      })
    })
  )
}
const getAnswersQuery =  (question_id, limit) => {
  console.log(`question id is equal to ${question_id}`);
  var stringifiedID = "'"+question_id+"'";
  return (
    `SELECT json_build_object (
      'question' , ${stringifiedID},
      'results', (
        SELECT json_agg (
          json_build_object (
            'answer_id', id,
            'body', body,
            'date', ( SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
            'answerer_name', answerer_name,
            'helpfulness', helpful,
            'photos', (
              SELECT coalesce ( json_agg (
                json_build_object (
                  'id', id,
                  'url', url
                )
                ),'[]'::json) FROM ( SELECT * FROM photo WHERE photo.answer_id = answer.id) AS photo
            )
          )
        ) FROM (SELECT * FROM answer WHERE question_id = ${Number(question_id)} limit ${limit}) AS answer
      )
    )`
  )
}


module.exports = {

  query: (text,values) => {
    return pool.query(text, values);
  },
  getQuestions: async (product_id, limit) => {
    var query = getQuestionsQuery(product_id,limit);
    //console.log(`question_id is equal to ${product_id}`);
    return pool.connect().then((client) => {
      return client
      .query(query)
      .then((result) => {
        //console.log(`result for getQuestion is equal to ${JSON.stringify(result.rows[0].json_build_object)}`)
        return result.rows[0].json_build_object
        //return result.rows
      })
      .catch((err) => {
        console.log(`err in getQuestions is equal to ${err}`);
        throw(err);
      })
    })

  },

  getAnswers: async (question_id, limit) => {
    var query = getAnswersQuery(question_id, limit);
    return pool.connect().then((client) => {
      return client
      .query(query)
      .then((result) => {
        return result.rows[0].json_build_object
      })
      .catch((err) => {
        console.log(`err in getAnswer is equal to ${err}`);
        throw(err);
      })
    })
  },


  addQuestion: async(question) => {
    console.log(`question is equal to ${JSON.stringify(question)}`);
     postQuestionsQuery(question)
     .then ((result) => {
      console.log(`result after adding into db is equal to ${JSON.stringify(result.rows[0].id)}`);
      return result.rows[0].id
     })
     .catch((err) => {
      console.log(`err in addQuestion `)
     })
  }
// pool.connect().then((client) => {
//   return client
//     .query(testQuery)
//     .then((res) => {
//       console.log(res.rows[0].questions.results)
//     })
//     .catch((err) => {
//       client.release()
//       console.log(err.stack)
//     })
// })
}



//SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"') from question limit 10;


// SELECT json_build_object (
//   'product_id',1,
//   'results', (
//      SELECT json_agg (
//       json_build_object (
//         'question id', id,
//         'question_body', body,
//         'question_date', date_written,
//         'asker_name', asker_name,
//         'question_helpfulness', helpful,
//         'reported', reported,
//         'answers',(
//           SELECT coalesce ( json_object_agg(
//             id,(
//               SELECT json_build_object(
//                 'id',id,
//                 'body', body,
//                 'date', ( SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
//                 'answerer_name',answerer_name,
//                 'helpfulness',helpful,
//                 'photos',(SELECT coalesce (json_agg(url), '[]'::json) FROM photo WHERE photo.answer_id = answer.id)
//               )
//             )
//           ), '{}'::json )FROM ANSWER WHERE answer.question_id = question.id
//         )
//       )
//      ) FROM question where product_id = 1 limit 10
//   )
// )


// SELECT json_build_object (
//   'question' , 1,
//   'results', (
//     SELECT json_agg (
//       json_build_object (
//         'answer_id', id,
//         'body', body,
//         'date', ( SELECT to_char(to_timestamp(date_written/1000),'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
//         'answerer_name', answerer_name,
//         'helpfulness', helpful,
//         'photos', (
//           SELECT coalesce ( json_agg (
//             json_build_object (
//               'id', id,
//               'url', url
//             )
//           ), '{}'::json ) FROM photo WHERE photo.answer_id = answer.id
//         )
//       )
//     ) FROM (SELECT * FROM answer WHERE question_id = 1 limit 1) AS answer
//   )
// )
