export default (obj: { [x: string]: string | number }) =>
  Object.entries(obj).reduce(
    (val, [key, value]) => `${val}${key}=${escape(value.toString() || "")}&`,
    ""
  );
