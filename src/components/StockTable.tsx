import { useState, useEffect } from "react";
import { getData } from "../data";
import { DatePicker, Table, Button } from "antd";
import type { GetProp, TableProps } from "antd";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface StockPriceType {
  date: string;
  stock: string;
  price: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<StockPriceType> = [
  {
    title: "Date",
    dataIndex: "date",
    sorter: true,
    width: "20%",
  },
  {
    title: "Stock Symbol",
    dataIndex: "stock",
    sorter: true,
    width: "20%",
  },
  {
    title: "Price",
    dataIndex: "price",
    width: "20%",
  },
];

function StockTable() {
  const [data, setData] = useState<StockPriceType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const formatData = (data) => {
    const newData: StockPriceType[] = [];

    if (data["Time Series (Daily)"]) {
      // Object.entries() returns an array of the key-value pairs in an object
      Object.entries(data["Time Series (Daily)"]).map(
        //(entry) => console.log(entry)
        ([key, value]) => {
          newData.push({
            date: key,
            stock: "APPL",
            price: value["4. close"],
          });
        }
      );
    }

    return newData;
  };

  const fetchData = () => {
    setLoading(true);
    getData("AAPL", "Daily").then((data) => {
      console.log(data);
      const formattedData: StockPriceType[] = formatData(data);
      console.log(formattedData);
      console.log(formattedData.length);
      setData(formattedData);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: formattedData.length,
        },
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      The stock price for Apple Computer on <DatePicker /> is:
      <Button
        type="primary"
        onClick={() => {
          console.log("Clicked button 1");
        }}
      >
        Button 1
      </Button>
      <h4>Apple Daily Stock Prices</h4>
      <Table
        columns={columns}
        rowKey={(record) => record.stock + record.date}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}

export default StockTable;
