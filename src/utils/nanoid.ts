import { customAlphabet } from "nanoid";

// https://github.com/CyberAP/nanoid-dictionary?tab=readme-ov-file#nolookalikes
export const nanoid = customAlphabet(
  "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz",
  11,
);
