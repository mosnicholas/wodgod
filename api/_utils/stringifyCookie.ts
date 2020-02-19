export default obj =>
  Object.entries(obj).reduce(
    (val, [key, value]) => `${val}${key}=${value}; `,
    ""
  );
