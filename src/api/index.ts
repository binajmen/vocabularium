import { action, cache } from "@solidjs/router";
import * as Session from "./session";
import * as User from "./users";

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
