// utils/validate.js

export function validateSignup({ fname, lname, phone, password }) {
  const errors = {};

  if (!fname?.trim()) errors.fname = "First name is required";
  if (!lname?.trim()) errors.lname = "Last name is required";

  if (!/^\d{10}$/.test(phone)) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  if (!/^\d{6}$/.test(password)) {
    errors.password = "Password must be exactly 6 digits";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
