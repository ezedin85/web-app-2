const jwt = require("jsonwebtoken");
const adminsModel = require("../models/adminModel");
require("dotenv").config();

function adminAuth(role) {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "Authorization required!" });
    }

    try {
      const token = authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.SECRET);
      const user = await adminsModel.findOne({ _id: id });

      //  Check if the user's role is included in the allowed roles.
      if (!role.includes(user.role)) {
        return res.status(401).json({ error: "Role Authorization Error" });
      }
      
      req.userId = user._id; //setting the users id
      next();
    } catch (error) {
      res.status(400).json({ error: "Request not authorized" });
    }
  };
}

module.exports = adminAuth;
