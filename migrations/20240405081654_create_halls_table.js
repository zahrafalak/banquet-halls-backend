exports.up = function (knex) {
  return knex.schema.createTable("halls", (table) => {
    table.increments("hall_id").primary();
    table.string("name", 255).notNullable();
    table.integer("capacity").notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("halls");
};
