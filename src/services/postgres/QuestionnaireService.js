/* eslint-disable no-underscore-dangle */

const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const categoryMapping = {
  Depression_Relaxation: "Relax",
  Depression_Motivation: "Motivation",
  Depression_Positive_Emotion_Reinforcement: "Depression",
  Anxiety_Relaxation: "Relax",
  Anxiety_Motivation: "Motivation",
  Anxiety_Positive_Emotion_Reinforcement: "Anxiety",
  Sleeplessness_Relaxation: "Sleep",
  Sleeplessness_Motivation: "Motivation",
  Sleeplessness_Positive_Emotion_Reinforcement: "Positive Energy",
};

class QuestionnaireService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: "5432",
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });
  }

  async getQuestions() {
    const query = {
      text: "SELECT question_id, question_text, options FROM questions",
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Question tidak ditemukan");
    }

    return result.rows;
  }

  async addAnswers(userId, answers) {
    await this.verifyUserFilled(userId);
    const answered_at = new Date().toISOString();
    const updated_at = new Date().toISOString();

    if (answers.length !== 2) {
      throw new InvariantError("Exactly two answers are required");
    }

    const combinedAnswerKey = answers
      .map((answer) => answer.answer.replace(/\s+/g, "_"))
      .join("_");
    const mood = categoryMapping[combinedAnswerKey];
    const answersData = answers.map(({ question_id, answer }) => ({
      question_id,
      answer,
    }));

    const query = {
      text: "INSERT INTO questionnaire (user_id, question_id, answer, mood, answered_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING mood",
      values: [
        userId,
        JSON.stringify(answersData.map(({ question_id }) => question_id)),
        JSON.stringify(answersData.map(({ answer }) => answer)),
        mood,
        answered_at,
        updated_at,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Failed to save answers");
    }

    return { mood };
  }

  async verifyUserFilled(userId) {
    const query = {
      text: "SELECT user_id FROM questionnaire WHERE user_id = $1",
      values: [userId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("User sudah mengisi Questionnaire");
    }
  }

  async updateAnswers(userId, answers) {
    const updated_at = new Date().toISOString();

    if (answers.length !== 2) {
      throw new InvariantError("Exactly two answers are required");
    }

    const combinedAnswerKey = answers
      .map((answer) => answer.answer.replace(/\s+/g, "_"))
      .join("_");
    const mood = categoryMapping[combinedAnswerKey];
    const answersData = answers.map(({ question_id, answer }) => ({
      question_id,
      answer,
    }));

    const query = {
      text: "UPDATE questionnaire SET answer = $3, mood = $4, updated_at = $5 WHERE user_id = $1 AND question_id = $2 RETURNING mood",
      values: [
        userId,
        JSON.stringify(answersData.map(({ question_id }) => question_id)),
        JSON.stringify(answersData.map(({ answer }) => answer)),
        mood,
        updated_at,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Failed to save answers");
    }

    return { mood };
  }

  async getMoodNameById(id) {
    const query = {
      text: "SELECT mood FROM questionnaire WHERE user_id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User Belum mengisi Questionnaire");
    }

    return result.rows[0].mood;
  }
}

module.exports = QuestionnaireService;
