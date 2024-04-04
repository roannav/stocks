import { useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio, Button, Space, AutoComplete } from "antd";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";
import LineChart from "./components/LineChart";
import CandleStickChart from "./components/CandleStickChart";
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
        <Button
          type="primary"
          onClick={() => {
            console.log("Clicked button 1");
          }}
        >
          Button 1
        </Button>
      </div>
      <div className="card">
        <Space>
          Stock Symbol:
          <AutoComplete
            style={{ width: 200 }}
            options={options}
            placeholder="type a stock symbol"
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            allowClear={true}
            onChange={()=>{console.log("AutoComplete onChange")}}
            onSelect={(value: string )=>{
              console.log("AutoComplete onSelect");
              console.log(value);
              setSymbol(value);
            }}
          />
        </Space>
      </div>
      <div className="card">
        <Space>
          Time Granularity:
          <Radio.Group onChange={onTimeGranularityChange} defaultValue="Daily">
            <Radio.Button value="Daily">Daily</Radio.Button>
            <Radio.Button value="Weekly">Weekly</Radio.Button>
            <Radio.Button value="Monthly">Monthly</Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      <div>
        <StockChart symbol={symbol} timeGranularity={timeGranularity} />
        {/* 
        <CandleStickChart />
        <LineChart />
        */}
        {/* <StockTable /> */}
      </div>
    </>
  );
}

export default App;
