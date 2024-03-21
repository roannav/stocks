// https://vitejs.dev/guide/env-and-mode.html
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
console.log(`ALPHA_VANTAGE_API_KEY is ${ALPHA_VANTAGE_API_KEY}`);

export const getData = async (symbol: string) => {
  const endpoint = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED";
  const response = await fetch( endpoint + `&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
  const data = await response.json();
  return data;
}

export const toXYData = (stockData) => {
  const xyData : { x: string, y: [string,string,string,string] }[] = [];

  if (stockData['Monthly Adjusted Time Series']) {
    // Object.entries() returns an array of the key-value pairs in an object
    Object.entries(stockData['Monthly Adjusted Time Series']).map(
      //(entry) => console.log(entry);
      ([key, value]) => {
        xyData.push({
          x: key,
          y: [
            value["1. open"],
            value["2. high"],
            value["3. low"],
            value["4. close"],
          ]      
        })
      } 
    )
  }

  return xyData;
}