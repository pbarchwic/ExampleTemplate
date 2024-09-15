import { AccessLevel } from "@app/core";

export const permissionIcons = {
  [AccessLevel.Guest]: "example_guest",
  [AccessLevel.Admin]: "example_admin",
  [AccessLevel.Owner]: "example_admin",
  [AccessLevel.None]: "example_add_permission",
};
