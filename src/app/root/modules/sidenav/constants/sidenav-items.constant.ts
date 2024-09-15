import { SidenavItem } from "../models";

// TODO: Some menu items temporary hidden. Will be used later
export const sidenavItems: SidenavItem[] = [
  // {
  //   name: 'dashboard',
  //   route: '/dashboard',
  //   icon: 'example_pack',
  // },
  {
    name: "permissions",
    route: "/permissions",
    icon: "example_key",
  },
  {
    name: "users",
    route: "/users",
    icon: "example_user",
    // children: [
    // {
    //   name: 'lists',
    //   route: '/users/lists',
    //   icon: 'example_lists',
    // },
    // {
    //   name: 'groups',
    //   route: '/users/groups',
    //   icon: 'example_groups',
    // },
    // ],
  },
  {
    name: "devices",
    route: "/devices",
    icon: "example_device",
  },
  // {
  //   name: 'alerts',
  //   route: '/alerts',
  //   icon: 'example_bell',
  // },
  {
    name: "settings",
    route: "/settings",
    icon: "example_manage",
  },
];
