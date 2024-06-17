/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    category_name: {
      type: "text",
      notNull: false,
    },
    name: {
      type: "Text",
      notNull: true,
    },
    duration: {
      type: "text",
      notNull: true,
    },
    url: {
      type: "Text",
      notNull: true,
    },
    artist_name: {
      type: "Text",
      notNull: true,
    },
    genre: {
      type: "Text",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
