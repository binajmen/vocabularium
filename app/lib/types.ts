import { LEXICON_TYPES } from "./constants";

export type LexiconType = (typeof LEXICON_TYPES)[number];

export type Conjugation = {
  s1: string;
  s2: string;
  s3: string;
  p1: string;
  p2: string;
  p3: string;
};