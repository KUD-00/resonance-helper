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
  reputation_base: number;
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
  max_price: number;
  min_price: number;
}

interface SellDataResponse {
  station_id: string;
  good_id: string;
  updated_at: string;
  trend: number;
  price: number;
  max_price: number;
  min_price: number;
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

interface PriceDetail {
  trend: number;
  not_num: number;
  is_rise: number;
  price: number;
  trade_num: number;
  interval_num: number;
  is_rare: number;
}

interface UserInfo {
  user_id: number;
  max_energy: number;
  energy: number;
  role_name: string;
  gold: number;
  level: number;
  move_energy: number;
  reputations: {
    [key: string]: number;
  }
}

interface MakeryGoodsRecipeItem {
  recipe: [string, number][];
  output: number;
  cost: number;
}

interface MakeryGoodsDict {
  [key: string]: MakeryGoodsRecipeItem;
}
