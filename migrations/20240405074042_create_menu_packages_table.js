exports.up = function (knex) {
  return knex.schema.createTable("menu_packages", (table) => {
    table.increments("package_id").primary();
    table.string("title", 255).notNullable();
    table.text("description").notNullable();
    table.decimal("price_per_head", 10, 2).notNullable();
    table.json("contents").notNullable();
    table.string("image_url", 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("menu_packages");
};
