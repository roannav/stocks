import { useState } from "react";
import { Button } from "antd";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";
import LineChart from "./components/LineChart";
import CandleStickChart from "./components/CandleStickChart";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Stocks</h1>
      <div className="card">
        <Button type="primary" onClick={()=> {console.log("Clicked button 1")}}>Button 1</Button>
      </div>
      <div>
        {/* <StockChart symbol={'GOOG'} /> */}
        <CandleStickChart />
        <LineChart />
        {/* <StockTable /> */}
      </div>
    </>
  );
}

export default App;
