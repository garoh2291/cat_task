import devConfig from "./config.dev.js";
import prodConfig from "./config.prod.js";

export default function () {
  if (process.env.NODE_ENV === "production") {
    return prodConfig;
  } else {
    return devConfig;
  }
}
