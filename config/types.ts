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
  stationId: string;
  type: string;
  name: I18string;
  goodsList: {[key: string]: number};
  sell_price_list: { [key: string]: number };
  buy_price_list: { [key: string]: number };
  reputation_base: number;
}

interface I18string {
  cn: string,
  en: string
}

interface DataResponse {
  station_id: string;
  good_id: string;
  updated_at: string;
  trend: number;
  price: number;
  max_price: number;
  min_price: number;
}

interface TransformedResponseData {
  [key: string]: {
    [key: string]: DataResponse
  }
}


interface StationProfitTable {
  [stationId: string]: ProfitTableCell[]
}

interface ProfitTableCell {
  goodId: string;
  targetStationId: string;
  buyPrice: number;
  sellPrice: number;
  perProfit: number;
  allProfit: number;
  updatedAt: number;
}

interface MakeryProfitTable {
  [key: string]: MakeryProfitCell[]
}

interface MakeryProfitCell {
  stationId: string,
  price: number,
  profit: number,
  profitRatio: number,
  updatedAt: number
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
