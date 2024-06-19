/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class RecommendationService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async getSongByMood(mood) {
    const query = {
      text: "SELECT DISTINCT s.id, s.name, s.duration, s.url, s.artist_name FROM songs s, categories c, questionnaire q WHERE q.mood = c.name AND c.name = s.category_name AND q.mood = $1",
      values: [mood],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Song Recomendation gagal di tampilkan");
    }

    const uniqueSongs = Array.from(
      new Set(result.rows.map((song) => song.id))
    ).map((id) => result.rows.find((song) => song.id === id));

    return uniqueSongs;
  }
}

module.exports = RecommendationService;
