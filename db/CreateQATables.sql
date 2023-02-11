
CREATE TABLE IF NOT EXISTS question (
    id SERIAL,
    product_id INT,
    body VARCHAR(250),
    date_written BIGINT,
    asker_name VARCHAR(250),
    asker_email VARCHAR(250),
    reported BOOLEAN,
    helpful INT,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS answer (
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
);
CREATE TABLE IF NOT EXISTS photo (
        id SERIAL,
        answer_id INT,
        url TEXT,
        FOREIGN KEY (answer_id) REFERENCES answer(id)
);

CREATE INDEX question_product_id_idx ON question(product_id);
CREATE INDEX question_id_idx ON question(id);
CREATE INDEX answer_question_id_idx ON answer(question_id);
CREATE INDEX photo_answer_id_idx ON photo(answer_id);

\COPY question from '/var/lib/postgresql/data/pgdata/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answer from '/var/lib/postgresql/data/pgdata/answers.csv' DELIMITER ',' CSV HEADER;

\COPY photo from '/var/lib/postgresql/data/pgdata/answers_photos.csv' DELIMITER ',' CSV HEADER;

SELECT setval('question_id_seq', (SELECT MAX(id) from question));
SELECT setval('answer_id_seq', (SELECT MAX(id) from answer));
SELECT setval('photo_id_seq', (SELECT MAX(id) from photo));
