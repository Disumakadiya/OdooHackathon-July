const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

const sendErrors = (res, errors) => res.status(400).json({ success: false, errors: errors.map((msg) => ({ msg })) });

const validatePayload = (payload, requiredFields = []) => {
  const errors = [];
  for (const field of requiredFields) {
    if (!payload[field]) errors.push(`${field} is required`);
  }
  for (const field of ['asset_id', 'description']) {
    if (field in payload && !payload[field]) errors.push(`${field} cannot be empty`);
  }
  if (payload.priority && !PRIORITIES.includes(payload.priority)) {
    errors.push('priority must be one of Low, Medium, High, Critical');
  }
  if (payload.status && !STATUSES.includes(payload.status)) {
    errors.push('status must be one of Open, In Progress, Resolved');
  }
  return errors;
};

export const validateCreateMaintenance = (req, res, next) => {
  const errors = validatePayload(req.body, ['asset_id', 'description']);
  if (errors.length > 0) return sendErrors(res, errors);
  next();
};

export const validateUpdateMaintenance = (req, res, next) => {
  const errors = validatePayload(req.body);
  if (errors.length > 0) return sendErrors(res, errors);
  next();
};

export const validateMaintenanceId = (req, res, next) => {
  if (!req.params.id) return sendErrors(res, ['Maintenance id is required']);
  next();
};
