exports.healthCheck = (req, res) => {
  res.status(200).json({ message: 'Controller layer ready' });
};
