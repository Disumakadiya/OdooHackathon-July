const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sendErrors = (res, errors) => res.status(400).json({ success: false, errors: errors.map((msg) => ({ msg })) });

export const validateCreateBooking = (req, res, next) => {
  const errors = [];
  for (const field of ['asset_id', 'employee_id', 'start_time', 'end_time', 'purpose']) {
    if (!req.body[field]) errors.push(`${field} is required`);
  }

  const start = parseDate(req.body.start_time);
  const end = parseDate(req.body.end_time);
  if (req.body.start_time && !start) errors.push('start_time must be a valid ISO date');
  if (req.body.end_time && !end) errors.push('end_time must be a valid ISO date');
  if (start && end && end <= start) errors.push('end_time must be greater than start_time');

  if (errors.length > 0) return sendErrors(res, errors);
  next();
};

export const validateUpdateBooking = (req, res, next) => {
  const errors = [];
  for (const field of ['asset_id', 'employee_id', 'purpose']) {
    if (field in req.body && !req.body[field]) errors.push(`${field} cannot be empty`);
  }

  const start = parseDate(req.body.start_time);
  const end = parseDate(req.body.end_time);
  if (req.body.start_time && !start) errors.push('start_time must be a valid ISO date');
  if (req.body.end_time && !end) errors.push('end_time must be a valid ISO date');
  if (start && end && end <= start) errors.push('end_time must be greater than start_time');

  if (errors.length > 0) return sendErrors(res, errors);
  next();
};

export const validateBookingId = (req, res, next) => {
  if (!req.params.id) return sendErrors(res, ['Booking id is required']);
  next();
};
