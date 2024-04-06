import { useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio, Space, AutoComplete } from "antd";
import StockChart from "./components/StockChart";
import CandleStickChart from "./components/CandleStickChart";
import LineChart from "./components/LineChart";
import UserTable from "./components/UserTable";
import StockTable from "./components/StockTable";
import "./App.css";

const options = [
  { value: "AAPL" },
  { value: "AMZN" },
  { value: "GOOG" },
  { value: "META" },
  { value: "MSFT" },
  { value: "NVDA" },
  { value: "RDDT" },
];

function App() {
  const [timeGranularity, setTimeGranularity] = useState("Daily");
  const [symbol, setSymbol] = useState("AAPL");

  const onTimeGranularityChange = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
    setTimeGranularity(e.target.value);
  };

  return (
    <>
      <h1>Stocks</h1>
      <div className="card">
        <Space direction="vertical" size="small">
          <Space>
            Stock Symbol:
            <AutoComplete
              style={{ width: 200 }}
              options={options}
              placeholder="type a stock symbol"
              filterOption={(inputValue, option) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              allowClear={true}
              onChange={() => {
                console.log("AutoComplete onChange");
              }}
              onSelect={(value: string) => {
                console.log("AutoComplete onSelect");
                console.log(value);
                setSymbol(value);
              }}
            />
          </Space>
          <Space>
            Time Granularity:
            <Radio.Group
              onChange={onTimeGranularityChange}
              defaultValue="Daily"
            >
              <Radio.Button value="Daily">Daily</Radio.Button>
              <Radio.Button value="Weekly">Weekly</Radio.Button>
              <Radio.Button value="Monthly">Monthly</Radio.Button>
            </Radio.Group>
          </Space>
          <StockChart symbol={symbol} timeGranularity={timeGranularity} />
        </Space>
      </div>

      <h1>Stock Table</h1>
      <div className="card">
        <StockTable />
      </div>

      <h1>Basic Charts with Sample Data</h1>
      <div className="card">
        <CandleStickChart />
      </div>
      <div className="card">
        <LineChart />
      </div>

      <h1>User Table with Random Data</h1>
      <div className="card">
        <UserTable />
      </div>
    </>
  );
}

export default App;
