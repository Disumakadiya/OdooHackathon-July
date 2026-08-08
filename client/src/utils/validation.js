export function validateAssetForm(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = "Asset name is required";
  if (!form.assetTag?.trim()) errors.assetTag = "Asset tag is required";
  if (!form.serialNumber?.trim()) errors.serialNumber = "Serial number is required";
  if (!form.category?.trim()) errors.category = "Category is required";
  return errors;
}

export function validateAllocationForm(data) {
  const errors = {};
  if (!data.assignedEmployee?.trim()) errors.assignedEmployee = "Employee name is required";
  return errors;
}

export function validateTransferForm(data) {
  const errors = {};
  if (!data.department?.trim()) errors.department = "Department is required";
  if (!data.location?.trim()) errors.location = "Location is required";
  return errors;
}

export function validateReturnForm(data) {
  const errors = {};
  if (!data.condition?.trim()) errors.condition = "Condition is required";
  return errors;
}
