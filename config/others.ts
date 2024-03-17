import { filteredStationDict } from "./old-stations";

export const defaultReputation = Object.fromEntries(
  filteredStationDict.map(([station_id]) => [station_id, 10])
);

export const defaultUser = {
  user_id: 0,
  max_energy: 200,
  energy: 200,
  role_name: "路人",
  gold: 2000000,
  level: 35,
  move_energy: 300,
  reputations: defaultReputation
}