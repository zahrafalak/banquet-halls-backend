const knex = require("knex")(require("../knexfile"));

const getHalls = async (_req, res) => {
  try {
    const data = await knex("halls");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Halls: ${err}`);
  }
};

module.exports = {
  getHalls,
};
