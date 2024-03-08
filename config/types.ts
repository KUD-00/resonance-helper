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
