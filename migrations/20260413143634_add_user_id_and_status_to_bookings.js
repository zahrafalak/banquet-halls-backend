exports.up = async (knex) => {
  await knex.schema.alterTable('booking_requests', (table) => {
    table.string('user_id').nullable();
    table.string('status').defaultTo('pending');
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('booking_requests', (table) => {
    table.dropColumn('user_id');
    table.dropColumn('status');
  });
};