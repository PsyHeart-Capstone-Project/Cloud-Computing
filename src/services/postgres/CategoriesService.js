/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class CategoriesService {
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
