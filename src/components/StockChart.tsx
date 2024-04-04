import { useState, useEffect, useMemo } from "react";
import { getData, toXYData } from "../data";
import Chart from "react-apexcharts";

type Props = {
  symbol: string;
  timeGranularity: string;
};

const StockChart = ({ symbol, timeGranularity }: Props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData(symbol, timeGranularity).then((data) => {
      console.log(data);
      setData(data);
    });
  }, [symbol, timeGranularity]);

  const seriesData = useMemo(() => toXYData(data, timeGranularity), [data, timeGranularity]);
  console.log(seriesData);

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart for " + symbol,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions:{
      candlestick: {
        colors: {
          upward: "#3C90EB",
          downward: "#DF7D46",
        },
      },
    }
  };

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={[{ data: seriesData}]}
            type="candlestick"
            width="500"
          />
        </div>
      </div>
    </div>
  );
};

export default StockChart;
