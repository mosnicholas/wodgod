export default (obj: { [x: string]: string }) =>
  Object.entries(obj).reduce(
    (val, [key, value]) => `${val}${key}=${escape(value || "")}&`,
    ""
  );
