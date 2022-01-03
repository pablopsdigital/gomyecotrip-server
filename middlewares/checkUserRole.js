/**
 *
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

/**
 *
 */
const isHosted = (req, res, next) => {
  if (req.user && req.user.isHosted) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Hosted Token' });
  }
};

/**
 *
 */
const isHostedOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isHosted || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin/Hosted Token' });
  }
};

module.exports = {
  isAdmin,
  isHosted,
  isHostedOrAdmin,
};
