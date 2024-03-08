export const calculateProfit = (buy: number, sell: number, buy_tax: number, sell_tax: number, amount: number): number => {
  return (sell - buy - sell * sell_tax - buy * buy_tax) * amount;
};

export const bestSellerStation = (good: string, stations: Station[]): [Station, number]=> {
  const best_seller_station = stations.reduce((acc, station) => {
    return station.sell_price_list[good] > acc.sell_price_list[good] ? station : acc;
  }, stations[0]);

  return [best_seller_station, best_seller_station.sell_price_list[good]];
};
