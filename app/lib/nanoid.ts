import { customAlphabet } from "nanoid";

// https://github.com/CyberAP/nanoid-dictionary#nolookalikes
const alphabet = "346789abcdefghijkmnpqrtwxyz";
const _nanoid = customAlphabet(alphabet, 13);

export default function nanoid(prefix?: string) {
  return prefix && prefix.length > 0 ? `${prefix}_${_nanoid()}` : _nanoid();
}
