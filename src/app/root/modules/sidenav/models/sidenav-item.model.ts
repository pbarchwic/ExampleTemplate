export interface SidenavItem {
  name: string;
  route: string;
  icon: string;
  children?: Array<SidenavItem>;
}
