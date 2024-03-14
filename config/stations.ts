const createStation = (
  station_id: string, 
  type: string, 
  name: I18string, 
  goods_list: { [key: string]: number },
  reputation_base: number
  ): Omit<Station, 'sell_price_list' | 'buy_price_list'> => {
  return {
    station_id,
    type,
    name,
    goods_list,
    reputation_base
  };
}

export const allStationDict: { [key: string]: Omit<Station, 'sell_price_list' | 'buy_price_list'>} = {
  83000001: createStation(
    "83000001",
    "city",
    { cn: "修格里城", en: "Shoggolith City" },
    {84700010: 34, 84700368: 17, 84700163: 40, 84700079: 46, 84700154: 52, 84700389: 68, 84700501: 74, 84700597: 86, 84700493: 114},
    0
  ),
  83000003: createStation(
    "83000003", 
    "station", 
    { cn: "荒原站", en: "Wilderness Station" },
    {84700624: 25, 84700232: 32, 84700675: 36, 84700615: 55, 84700408: 70, 84700135: 101, 84701644: 100},
    0
  ),
  83000004: createStation(
    "83000004", 
    "station", 
    { cn: "淘金乐园", en: "Onederland" },
    {84700019: 1000, 84700816: 1000, 84700103: 1000, 84700440: 1000, 84701611: 1000, 84700307: 1000},
    0
  ),
  83000014: createStation(
    "83000014", 
    "station", 
    { cn: "阿妮塔能源研究所", en: "Anita Energy Research Institute" },
    {84700059: 1000, 84700548: 1000, 84700106: 1000, 84700530: 1000, 84700053: 1000, 84700195: 1000},
    7.5
  ),
  83000020: createStation(
    "83000020", 
    "city", 
    { cn: "7号自由港", en: "FreePort VII" },
    {84700182: 1000, 84700199: 1000, 84700330: 1000, 84700509: 1000, 84700094: 1000, 84700311: 1000, 84700215: 1000, 84700563: 1000, 84700443: 1000},
    7.5
  ),
  83000026: createStation(
    "83000026",
    "station",
    { cn: "铁盟哨站", en: ""},
    { 84700993: 1000, 84700994: 1000, 84700995: 1000, 84700996: 1000, 84700997: 1000, 84700998: 1000, 84700999: 1000, 84700465: 1000},
    0
  ),
  83000029: createStation(
    "83000029",
    "station",
    { cn: "澄明数据中心", en: "Clarity Data Center Administration Bureau" },
    {84700105: 1000, 84700291: 1000, 84700460: 1000, 84700342: 1000, 84700420: 1000, 84700423: 1000, 84700540: 1000, 84700453: 1000},
    10
  ),
  83000053: createStation(
    "83000053",
    "station",
    { cn: "曼德矿场", en: "Mander Mine" },
    {84700481: 1000, 84701612: 1000, 84700610: 1000, 84700395: 1000, 84700690: 1000, 84700511: 1000, 84700221: 1000, 84700262: 1000, 84700381: 1000, 84700392: 1000},
    0
  ),
  10000000: createStation(
    "10000000",
    "unknown",
    { cn: "未知", en: "Unknown" },
    {},
    0
  ),
  20000000: createStation(
    "20000000",
    "make",
    { cn: "手作商品", en: "make" },
    {},
    0
  )
}

export const filteredStationDict = Object.entries(allStationDict)
  .filter(([station_id, station]) => station.type !== 'unknown' && station.type !== 'make');

export const filterdStationIds = filteredStationDict.map(([station_id, station]) => station_id);

export const getStationGoods = (station_id: string) => Object.entries(allStationDict[station_id].goods_list)

export const getStationName = (station_id: string) => {
  return allStationDict[station_id].name.cn
}

export const getStock = (station_id: string, good_id: string) => {
  return allStationDict[station_id].goods_list[good_id]
}