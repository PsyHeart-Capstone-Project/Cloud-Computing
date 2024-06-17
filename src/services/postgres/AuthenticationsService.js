/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const TokenManager = require("../../tokenize/TokenManager");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: "5432",
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });
  }

  async addToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES ($1)",
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Token tidak valid");
    }
  }

  async isUserLoggedIn(userId) {
    const query = {
      text: "SELECT token FROM authentications",
    };
    const result = await this._pool.query(query);

    const tokens = result.rows.map((row) => row.token);
    for (let token of tokens) {
      const { id } = TokenManager.verifyToken(token);
      if (id === userId) {
        throw new InvariantError("User is already logged in");
      }
    }
  }

  async deleteToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
