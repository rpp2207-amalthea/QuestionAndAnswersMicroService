
const db = require('../db')

const { Pool } = require('pg');

const pool = new Pool({
  "host": '127.0.0.1',
  "user": "andyma",
  "password": '',
  "port": 5432,
  "database": 'questionsandanswers',
  // "max" : 1000,
  // "connectionTimeoutMillis": 0,
  // "idleTimeoutMillis": 0
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
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
         ) FROM (SELECT * FROM question WHERE product_id = ${Number(product_id)} AND reported = false limit ${Number(limit)}) AS question
      )
    )`
  )
};

const postQuestionQuery = async (newQuestion) => {
  return (
    pool.query (`INSERT INTO question(product_id, body, date_written,asker_name,asker_email,reported,helpful)
      VALUES ( $1, $2, (SELECT extract(epoch FROM  now()) * 1000), $3, $4, false, 0) RETURNING id`, [newQuestion.product_id, newQuestion.body, newQuestion.name, newQuestion.email])
      .then ((result) => {
        return result;
      })
  )
}

const getAnswersQuery =  (question_id, limit) => {
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
        ) FROM (SELECT * FROM answer WHERE question_id = ${Number(question_id)} AND reported = false limit ${limit}) AS answer
      )
    )`
  )
}

const postAnswerQuery = (question_id, newAnswer) => {
  // console.log(`typeof question_id in post answer is equal to ${question_id}`)
  // console.log(`newanswer is equal to ${JSON.stringify(newAnswer)}`)
  return (
    pool.query (
      `INSERT INTO answer(question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
      VALUES ( $1, $2, (SELECT extract(epoch FROM  now()) * 1000), $3, $4, false, 0) RETURNING id`, [Number(question_id), newAnswer.body, newAnswer.name, newAnswer.email]
      )
      .then((result) => {
        console.log(`answer submitted!`)
        if(newAnswer.url.length !== 0) {
          client.query ( `INSERT INTO photo ( answer_id, url) VALUES ( $1, $2 )`, [result.rows[0].id, newAnswer.url])
        }
      })
      .then ((result) => {
        return result;
      })
      .catch((err) => {
        console.log(`err in posting question query : ${err}`)
      })
  )

}

const markQuestionHelpfulQuery = (question_id) => {
  return (
        `UPDATE question SET helpful = helpful +1 WHERE id = ${question_id} `
  )
}

const markAnswerHelpfulQuery = (answer_id) => {
  return (
        `UPDATE answer SET helpful = helpful +1 WHERE id = ${answer_id} `
  )
}

const reportQuestionQuery = (question_id) => {
  return (
        `UPDATE question SET reported = true WHERE id = ${question_id} `
  )
}

const reportAnswerQuery = (answer_id) => {
  return (
    `UPDATE answer SET reported = true WHERE id = ${answer_id} `
  )
}
module.exports = {

  query: (text,values) => {
    return pool.query(text, values);
  },
  getQuestions: async (product_id, limit) => {
    var query = getQuestionsQuery(product_id,limit);
      return db.query(query)
      .then((result) => {
        return result.rows[0].json_build_object
      })
      .catch((err) => {
        console.log(`err in getQuestions is equal to ${err}`);
        throw(err);
        //next(err);
      })

  },

  getAnswers: async (question_id, limit) => {
    var query = getAnswersQuery(question_id, limit);
    return pool.query(query)
      .then((result) => {
        return result.rows[0].json_build_object
      })
      .catch((err) => {
        console.log(`err in getAnswer is equal to ${err}`);
        throw(err);
      })
  },

  addAnswer: async(question_id, newAnswer) => {
    //console.log(`question_id is equal to ${JSON.stringify(question_id)}`);
    postAnswerQuery(question_id, newAnswer)
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(`err in addAnswer : ${err} `)
     })

  },

  addQuestion: async(question) => {
     postQuestionQuery(question)
     .then ((result) => {
      return result.rows[0].id
     })
     .catch((err) => {
      console.log(`err in addQuestion: ${err}`)
     })
  },

  markQuestionHelpful: async(question_id) => {
    var query = markQuestionHelpfulQuery(question_id);
    return pool.query(query)
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(`err in markQuestionHelpful is equal to ${err}`);
        throw(err);
      })
  },

  markAnswerHelpful: async(answer_id) => {
    var query = markAnswerHelpfulQuery(answer_id);
    return pool.query(query)
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(`err in markAnswerHelpful is equal to ${err}`);
        throw(err);
      })
  },

  reportQuestion: async(question_id) => {
    var query = reportQuestionQuery(question_id);
    return pool.query(query)
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(`err in reportQuestion is equal to ${err}`);
        throw(err);
      })
  },

  reportAnswer: async(answer_id) => {
    var query = reportAnswerQuery(answer_id);
    return pool.query(query)
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(`err in reportAnswer is equal to ${err}`);
        throw(err);
      })
  }
}


