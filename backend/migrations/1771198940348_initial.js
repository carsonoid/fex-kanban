/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("boards", {
    id: { type: "uuid", notNull: true, primaryKey: true },
    name: { type: "varchar(1000)", notNull: true },
    description: { type: "varchar(1000)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
  });
  pgm.createIndex('boards', 'id');

  pgm.createTable("columns", {
    id: { type: "uuid", notNull: true, primaryKey: true },
    board_id: { type: "uuid", notNull: true, references: "boards(id)", onDelete: 'CASCADE' },
    name: { type: "varchar(1000)", notNull: true },
    order: { type: "integer" },
    wip_limit: { type: "integer" },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
  });
  pgm.createIndex('columns', ['id', 'board_id']);

  pgm.createTable("cards", {
    id: { type: "uuid", notNull: true, primaryKey: true },
    column_id: { type: "uuid", notNull: true, references: "columns(id)", onDelete: 'CASCADE'  },
    name: { type: "varchar(1000)", notNull: true },
    description: { type: "varchar(1000)"},
    order: { type: "integer" },
    priority: { type: "string" },
    labels: { type: "jsonb" },
    due_date: {
      type: "timestamp",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
  });
  pgm.createIndex('cards', ['id', 'column_id']);

  pgm.createTable("subtasks", {
    id: { type: "uuid", notNull: true, primaryKey: true },
    card_id: { type: "uuid", notNull: true, references: "cards(id)", onDelete: 'CASCADE'  },
    name: { type: "varchar(1000)", notNull: true },
    completed: { type: "boolean" },
  });
  pgm.createIndex('subtasks', ['id', 'card_id']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
