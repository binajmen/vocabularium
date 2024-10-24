import { action, cache } from "@solidjs/router";
import * as Session from "./session";
import * as User from "./users";
import * as Deck from "./decks";

export const loginOrRegister = action(
  Session.loginOrRegister,
  "loginOrRegister",
);
export const logout = action(Session.logout, "logout");
export const getUserBySession = cache(
  Session.getUserBySession,
  "getUserBySession",
);

export const getUsers = cache(User.getUsers, "users");

export const getDeckWithCards = cache(
  async (id: string) => Deck.getDeckWithCards(id),
  "deck-with-cards",
);
