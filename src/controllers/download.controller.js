const User = require("../models/user.model.js");
const downloadResource = require("../util/download");
// Create and Save a new User

// Delete a User with the specified userId in the request
exports.download = async (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else {
      const fields = [
        {
          label: "First Name",
          value: "first_name",
        },
        {
          label: "Last Name",
          value: "last_name",
        },
        {
          label: "Email Address",
          value: "email_address",
        },
      ];

      return downloadResource(res, "users.csv", fields, data);
    }
  });
};
