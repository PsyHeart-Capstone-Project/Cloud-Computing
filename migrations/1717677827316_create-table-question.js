/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("questions", {
    question_id: {
      type: "Serial",
      primaryKey: true,
    },
    question_text: {
      type: "Text",
      notNull: true,
    },
    options: {
      type: "JSONB",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("questions");
};
