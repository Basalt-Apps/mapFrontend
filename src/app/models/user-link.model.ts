export interface UserLinkModel {
  mapID: number,
  links: UserLink[]
}

export interface UserLink {
  UserID: number,
  Username: number,
  Admin: boolean,
  Selected: boolean
}
