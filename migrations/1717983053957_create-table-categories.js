/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("categories", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "Text",
      notNull: true,
      unique: true,
    },
    img_url: {
      type: "Text",
      notNull: true,
    },
    description: {
      type: "Text",
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
  pgm.dropTable("categories");
};
