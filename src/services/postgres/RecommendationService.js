/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class RecommendationService {
  constructor() {
    if (process.env.NODE_ENV === "development") {
      this._pool = new Pool({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: "5432",
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      });
    } else {
      this._pool = new Pool();
    }
  }

  async getSongByMood(mood) {
    const query = {
      text: "SELECT s.id, s.name, s.duration, s.url, s.artist_name FROM songs s, categories c, questionnaire q WHERE q.mood = c.name AND c.name = s.category_name AND q.mood = $1 ORDER BY CASE WHEN s.id = 1 THEN 0 ELSE 1 END, s.id",
      values: [mood],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Song Recomendation gagal di tampilkan");
    }

    return result.rows;
  }
}

module.exports = RecommendationService;
