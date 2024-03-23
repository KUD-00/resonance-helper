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
  goodName: string;
  targetStationId: string;
  targetStationName: string;
  buyPrice: number;
  sellPrice: number;
  buyPercent: number;
  sellPercent: number;
  buyPriceTrend: number;
  sellPriceTrend: number;
  buyStationName: string;
  perProfit: number;
  allProfit: number;
  updatedAt: number;
  rawProfit: number;
  rawAllProfit: number;
  buyStationId: string;
  stock: number;
}

interface SellInfo {
  goodId: string;
  targetStationId: string;
  buyStationId: string;

  buyPrice: number;
  sellPrice: number;

  buyPriceTrend: number;
  sellPriceTrend: number;

  baseStock: number;
  stockModify: number;

  buyTax: number;
  sellTax: number;

  updatedAt: number;

  goodName: string;
  buyStationName: string;
  targetStationName: string;
}


interface StationSellInfoDict {
  [stationId: string]: SellInfo[]
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
  role_name: string;
  level: number;
  trade_level: number;
  reputations: {
    [key: string]: number;
  };
  default_book: number;
  default_per_stock_profit: number;
}

interface MakeryGoodsRecipeItem {
  recipe: [string, number][];
  output: number;
  cost: number;
}

interface MakeryGoodsDict {
  [key: string]: MakeryGoodsRecipeItem;
}

interface StationGoodsListDict {
  [stationId: string]: string[];
}

interface OriginalGood {
  id: number;
  idCN: string;
  mod: string;
  isInformalData: boolean;
  goodsId: number;
  price: number;
  minQuotation: number;
  maxQuotation: number;
  num: number;
  stockMultipleMin: number;
  stockMultipleMax: number;
  isSudden: boolean;
  needDevelopNum: number;
  needItem: number;
  needItemNum: number;
}

interface Good {
  id: string;
  basePrice: number;
  minQuotation: number;
  maxQuotation: number;
  baseStock: number;
}

interface StationGoodsInfo {
  buy?: Good;
  sell?: Good;
}

interface GoodsDict {
  [goodsId: string]: {
    name: string;
    stations: {
      [stationId: string]: StationGoodsInfo;
    };
  };
}

interface BestProfitTable { 
  [stationID: string]: ProfitTable
} 

interface ProfitTable { 
  targetStationId: string,
  goods: ProfitTableCell[],
  totalProfit: number,
  sumStock: number
} 

interface OptimizedProfitTable {
  [stationId: string]: ProfitTable[]
}

interface ProfitByTargetStation {
  [targetStationId: string]: {
    goods: ProfitTableCell[];
    totalProfit: number;
  };
}
