interface SellCorrespond {
  good_id: string;
  station_id: string;
}

interface Good {
  good_id: string;
  name: string;
  is_special: boolean;
  sell_correspond: SellCorrespond[]
}

interface Station {
  station_id: string;
  type: string;
  name: I18string;
  goods_list: {[key: string]: number};
  sell_price_list: { [key: string]: number };
  buy_price_list: { [key: string]: number };
}

interface I18string {
  cn: string,
  en: string
}

interface BuyDataResponse {
  station_id: string;
  good_id: string;
  updated_at: string;
  trend: number;
  price: number;
}

interface SellDataResponse {
  station_id: string;
  good_id: string;
  updated_at: string;
  trend: number;
  price: number;
}

type TransformedSellDataDict = {
  [goodId: string]: SellDataResponse;
};

interface TransformedBuyData {
  [key: string]: {
    [key: string]: BuyDataResponse
  }
}


interface StationProfitTable {
  [station_id: string]: ProfitTableCell[]
}

interface ProfitTableCell {
  good_id: string;
  target_station_id: string;
  buy_price: number;
  sell_price: number;
  per_profit: number;
  all_profit: number;
  updated_at: number;
}

interface MakeryProfitTable {
  [key: string]: MakeryProfitCell[]
}

interface MakeryProfitCell {
  station_id: string,
  price: number,
  profit: number,
  profit_ratio: number,
  updated_at: number
}