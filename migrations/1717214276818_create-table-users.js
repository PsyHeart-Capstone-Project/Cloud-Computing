/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    email: {
      type: "VARCHAR(50)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "Text",
      notNull: true,
    },
    name: {
      type: "Text",
      notNull: true,
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
