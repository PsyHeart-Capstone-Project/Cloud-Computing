/* eslint-disable no-underscore-dangle */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
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

  async addUser({ email, password, name }) {
    await this.verifyNewEmail(email);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, email, hashedPassword, name, created_at, updated_at],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async verifyNewEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Gagal. Email sudah digunakan.");
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, email, password, name FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(
        "Email tidak terdaftar. Pastikan input Email sesuai!"
      );
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Password yang Anda berikan salah");
    }

    return id;
  }

  async updateProfileUser({ id, email, new_password, name }) {
    const existingUser = await this.getUserById(id);

    email = email || existingUser.email;
    new_password = new_password
      ? await bcrypt.hash(new_password, 10)
      : existingUser.password;
    name = name || existingUser.name;

    const updated_at = new Date().toISOString();

    const query = {
      text: "UPDATE users SET email = $2, password = $3, name = $4, updated_at = $5 WHERE id = $1 RETURNING id, email, name",
      values: [id, email, new_password, name, updated_at],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Profile gagal diperbarui");
    }

    return result.rows[0];
  }
}

module.exports = UsersService;
