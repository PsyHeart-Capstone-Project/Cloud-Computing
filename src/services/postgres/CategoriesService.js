/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class CategoriesService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async getCategories() {
    const query = {
      text: "SELECT * FROM categories ORDER BY CASE WHEN id = 1 THEN 0 ELSE 1 END, id",
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Category gagal di tampilkan");
    }

    return result.rows;
  }

  async getCategoryDetail(id) {
    const query = {
      text: "SELECT s.id, s.name, s.duration, s.url, s.artist_name, c.name as c_name, c.description as c_desc FROM songs s, categories c WHERE c.name = s.category_name AND c.id = $1 ORDER BY CASE WHEN s.id = 1 THEN 0 ELSE 1 END, s.id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Category Detail gagal di tampilkan");
    }

    return result.rows;
  }
}

module.exports = CategoriesService;
