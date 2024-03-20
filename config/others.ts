import { filteredStationsDict } from "./stations";

export const defaultReputation = Object.fromEntries(
  Object.entries(filteredStationsDict).map(([stationId]) => [stationId, 10])
);

export const defaultUser: UserInfo = {
  user_id: 0,
  role_name: "路人",
  level: 35,
  trade_level: 50,
  reputations: defaultReputation
}