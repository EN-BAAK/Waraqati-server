export const unflatten = (body: any) => {
  const result: any = {};
  for (const key in body) {
    const value = body[key];
    const keys = key.split(".");

    keys.reduce((acc, part, idx) => {
      if (idx === keys.length - 1) {
        acc[part] = value;
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, result);
  }
  return result;
}
