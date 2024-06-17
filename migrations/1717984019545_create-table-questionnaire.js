/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("questionnaire", {
    user_id: {
      type: "Text",
      notNull: true,
      references: "users (id)",
    },
    question_id: {
      type: "JSONB",
      notNull: true,
    },
    answer: {
      type: "JSONB",
      notNull: true,
    },
    mood: {
      type: "Text",
      notNull: true,
      references: "categories (name)",
    },
    answered_at: {
      type: "Text",
      notNull: true,
    },
    updated_at: {
      type: "Text",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("questionnaire");
};
