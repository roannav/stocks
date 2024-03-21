import { useState, useEffect, useMemo } from "react";
import { getData, toXYData } from "../data";
import Chart from "react-apexcharts";

type Props = {
  symbol: string;
};

const StockChart = ({ symbol }: Props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData(symbol).then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);

  const seriesData = useMemo(() => toXYData(data), [data]);
  console.log(seriesData);

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
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
    candlestick: {
      colors: {
        upward: "#3C90EB",
        downward: "#DF7D46",
      },
    },
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
