const knex = require("knex")(require("../knexfile"));

const getHalls = async (_req, res) => {
  try {
    const data = await knex("halls");
    res.status(200).json(data);
  } catch (err) {
    console.error(`Error retrieving halls: ${err}`);
    res.status(500).json({ message: "Could not retrieve halls" });
  }
};

module.exports = {
  getHalls,
};
