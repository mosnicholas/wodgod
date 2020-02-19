import { wodCookie } from "./constants";

export default () =>
  Object.entries(wodCookie).reduce(
    (val, [key, value]) => `${val} ${key}=${value};`,
    ""
  );
