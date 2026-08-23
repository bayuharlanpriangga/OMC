// Lat/Lon lookup (major cities — extended)
const CITY_LL = {
  'jakarta':[-6.2,106.8],'bandung':[-6.9,107.6],'surabaya':[-7.3,112.7],'yogyakarta':[-7.8,110.4],
  'bali':[-8.4,115.2],'denpasar':[-8.65,115.22],'medan':[3.6,98.7],'semarang':[-7.0,110.4],
  'singapore':[1.35,103.82],'kuala lumpur':[3.15,101.7],'bangkok':[13.75,100.5],'manila':[14.6,121.0],
  'tokyo':[35.68,139.69],'seoul':[37.57,126.98],'beijing':[39.9,116.4],'shanghai':[31.23,121.47],
  'hong kong':[22.32,114.17],'london':[51.5,-0.12],'paris':[48.85,2.35],'berlin':[52.52,13.4],
  'new york':[40.71,-74.0],'los angeles':[34.05,-118.24],'sydney':[-33.87,151.21],'melbourne':[-37.81,144.96],
  'dubai':[25.2,55.27],'mumbai':[19.07,72.88],'delhi':[28.61,77.2],'cairo':[30.05,31.25],
  'default':[-6.2,106.8]
};

function getLatLon(city) {
  const c = city.toLowerCase();
  for(const k in CITY_LL) { if(c.includes(k)) return CITY_LL[k]; }
  return CITY_LL.default;
}

// Approximate timezone from longitude
function tzFromLon(lon) { return Math.round(lon/15); }

