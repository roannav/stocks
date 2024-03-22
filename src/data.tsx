// https://vitejs.dev/guide/env-and-mode.html
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
console.log(`ALPHA_VANTAGE_API_KEY is ${ALPHA_VANTAGE_API_KEY}`);

const getDataFunctionName = ( timeGranularity: string) : string => {
  if (timeGranularity === "Daily") {
    return "TIME_SERIES_DAILY";
  } else if (timeGranularity === "Weekly") {
    return "TIME_SERIES_WEEKLY_ADJUSTED";
  } else if (timeGranularity === "Monthly") {
    return "TIME_SERIES_MONTHLY_ADJUSTED";
  }
  return "";
}

export const getData = async (symbol: string, timeGranularity: string) => {
  const endpoint = "https://www.alphavantage.co/query?function=" + getDataFunctionName(timeGranularity);
  const response = await fetch( endpoint + `&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
  const data = await response.json();
  return data;
}

const getDataName = ( timeGranularity: string) : string => {
  if (timeGranularity === "Daily") {
    return "Time Series (Daily)";
  } else if (timeGranularity === "Weekly") {
    return "Weekly Adjusted Time Series";
  } else if (timeGranularity === "Monthly") {
    return "Monthly Adjusted Time Series";
  }
  return "";
}

export const toXYData = (stockData, timeGranularity: string) => {
  const xyData : { x: string, y: [string,string,string,string] }[] = [];

  const dataName = getDataName(timeGranularity);
  if (stockData[dataName]) {
    // Object.entries() returns an array of the key-value pairs in an object
    Object.entries(stockData[dataName]).map(
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