import {  body, param, validationResult  } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const validateCreateBooking = [
  body('asset_id').exists({ checkFalsy: true }).withMessage('asset_id is required'),
  body('employee_id').exists({ checkFalsy: true }).withMessage('employee_id is required'),
  body('start_time').exists({ checkFalsy: true }).withMessage('start_time is required'),
  body('end_time').exists({ checkFalsy: true }).withMessage('end_time is required'),
  body('purpose').exists({ checkFalsy: true }).withMessage('purpose is required'),
  body('start_time').isISO8601().withMessage('start_time must be a valid ISO date'),
  body('end_time').isISO8601().withMessage('end_time must be a valid ISO date'),
  body('end_time').custom((value, { req }) => {
    const start = parseDate(req.body.start_time);
    const end = parseDate(value);

    if (!start || !end) {
      return true;
    }

    if (end <= start) {
      throw new Error('end_time must be greater than start_time');
    }

    return true;
  }),
  validate,
];

export const validateUpdateBooking = [
  body('asset_id').optional({ values: 'falsy' }).notEmpty().withMessage('asset_id cannot be empty'),
  body('employee_id').optional({ values: 'falsy' }).notEmpty().withMessage('employee_id cannot be empty'),
  body('start_time').optional({ values: 'falsy' }).isISO8601().withMessage('start_time must be a valid ISO date'),
  body('end_time').optional({ values: 'falsy' }).isISO8601().withMessage('end_time must be a valid ISO date'),
  body('purpose').optional({ values: 'falsy' }).notEmpty().withMessage('purpose cannot be empty'),
  body('end_time').optional({ values: 'falsy' }).custom((value, { req }) => {
    const start = parseDate(req.body.start_time);
    const end = parseDate(value);

    if (!start || !end) {
      return true;
    }

    if (end <= start) {
      throw new Error('end_time must be greater than start_time');
    }

    return true;
  }),
  validate,
];

export const validateBookingId = [
  param('id').notEmpty().withMessage('Booking id is required'),
  validate,
];
