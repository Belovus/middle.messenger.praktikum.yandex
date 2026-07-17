export function formDataToJSON(formData: FormData) {
  const jsonObject: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });

  return jsonObject;
}
