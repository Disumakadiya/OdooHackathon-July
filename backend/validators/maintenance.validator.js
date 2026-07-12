const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

exports.validateCreateMaintenance = [
  body('asset_id').exists({ checkFalsy: true }).withMessage('asset_id is required'),
  body('description').exists({ checkFalsy: true }).withMessage('description is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('priority must be one of Low, Medium, High, Critical'),
  body('status').optional().isIn(['Open', 'In Progress', 'Resolved']).withMessage('status must be one of Open, In Progress, Resolved'),
  validate,
];

exports.validateUpdateMaintenance = [
  body('asset_id').optional({ values: 'falsy' }).notEmpty().withMessage('asset_id cannot be empty'),
  body('description').optional({ values: 'falsy' }).notEmpty().withMessage('description cannot be empty'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('priority must be one of Low, Medium, High, Critical'),
  body('status').optional().isIn(['Open', 'In Progress', 'Resolved']).withMessage('status must be one of Open, In Progress, Resolved'),
  validate,
];

exports.validateMaintenanceId = [
  param('id').notEmpty().withMessage('Maintenance id is required'),
  validate,
];
