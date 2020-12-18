const getPasswordByUserId = `SELECT password FROM paf2020.user WHERE user_id= ?`;

module.exports = {
  getPasswordByUserId
};
