export const zodResolver = (schema: any) => async (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  const errors = result.error.flatten().fieldErrors;
  const formattedErrors = Object.keys(errors).reduce((acc: any, key) => {
    acc[key] = { type: 'validation', message: errors[key]?.[0] };
    return acc;
  }, {});
  return { values: {}, errors: formattedErrors };
};
