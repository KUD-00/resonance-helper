import { filteredStationsDict } from "./stations";

export const defaultReputation = Object.fromEntries(
  Object.entries(filteredStationsDict).map(([stationId]) => [stationId, 10])
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