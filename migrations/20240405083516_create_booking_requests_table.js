exports.up = function (knex) {
  return knex.schema.createTable("booking_requests", (table) => {
    table.increments("booking_id").primary();
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.integer("hall_id").unsigned().notNullable();
    table.integer("menu_package_id").unsigned();
    table.date("event_date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .enu("status", ["Pending", "Confirmed", "Cancelled", "Completed"])
      .notNullable();

    table.foreign("hall_id").references("halls.hall_id");
    table.foreign("menu_package_id").references("menu_packages.package_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("booking_requests");
};
