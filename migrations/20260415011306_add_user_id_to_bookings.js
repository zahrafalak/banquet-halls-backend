exports.up = async (knex) => {
  await knex.schema.alterTable('booking_requests', (table) => {
    table.string('user_id').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('booking_requests', (table) => {
    table.dropColumn('user_id');
  });
};