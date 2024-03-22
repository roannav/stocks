import { useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import { Button } from "antd";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";
import LineChart from "./components/LineChart";
import CandleStickChart from "./components/CandleStickChart";
import "./App.css";

function App() {
  const [timeGranularity, setTimeGranularity] = useState("Daily");

  const onChange = (e: RadioChangeEvent) => {
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
        Choose a Time Granularity:
        <Radio.Group onChange={onChange} defaultValue="Daily">
          <Radio.Button value="Daily">Daily</Radio.Button>
          <Radio.Button value="Weekly">Weekly</Radio.Button>
          <Radio.Button value="Monthly">Monthly</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <StockChart symbol={'MSFT'} timeGranularity={timeGranularity} />
        <CandleStickChart />
        <LineChart />
        {/* <StockTable /> */}
      </div>
    </>
  );
}

export default App;
