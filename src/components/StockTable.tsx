import { useState, useEffect } from "react";
import { getData } from "../data";
import { DatePicker, Table } from "antd";
import type { GetProp, TableProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
const dateFormat = "YYYY-MM-DD";

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

const today = dayjs();
const defaultDate = today.subtract(1, 'day'); // yesterday

function StockTable() {
  const [data, setData] = useState<StockPriceType[]>();
  //console.log(`StockTable: data is ${data}`);  // undefined
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [ queryDate, setQueryDate] = useState(defaultDate);
  const [ price, setPrice] = useState(0);

  useEffect(() => {
    setPrice(priceOnDate(queryDate));
  }, [queryDate, data]);


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

  const minDate = data ? data[data.length - 1].date : "";
  const maxDate = data ? data[0].date : "";

  // Function to find the index of the entry object with the date property
  // that equals the parameter dateString (eg '2022-01-01')
  const findIndexByDateString = (dateString: string) => {
    return data?.findIndex(entry => dayjs(entry.date).isSame(dateString, 'day'));
  }

  const isWeekend = (date : dayjs.Dayjs) => {
    return date.day() === 6 || date.day() === 0; // 6 is Saturday, 0 is Sunday
  }

  const priceOnDate = ( date: dayjs.Dayjs) : number => {
    if ((!date) || (!minDate) || (!maxDate) 
      || (date.isAfter(dayjs(maxDate)))
      || (date.isBefore(dayjs(minDate)))
     ) {
      return 0;
    }

    const dateString: string = date.format('YYYY-MM-DD');
    console.log("priceOnDate(): Getting the price on", dateString);
    if (!data)
      return 0;

    // data[0].date is the most recent date, usually today.
    // data[data.length].date is the oldest date
    
    // Create dayjs object representing date
    const date1 = dayjs(data[0].date);

    // I can't just calculate the difference in days, 
    // because the days in data are not consecutive.
    // There are no entries for weekend days. Or possibly special holidays too
    // when the stock market is closed.
    //const differenceInDays = date1.diff(date, 'day');
    //console.log(differenceInDays); 

    // If the date is on the weekend, use the Friday before's price,
    // since data doesn't include prices for the weekend.
    // If it's a holiday, use the first valid date before the holiday.

    // Finding the index of the entry object with matching date (eg '2022-01-01')

    const index = findIndexByDateString(dateString);
    if (!index || index < 0 || index >= data.length) {
      return priceOnDate(date.subtract(1, 'day')); // try again with the day before 
    }

    const price = data[index].price;
    console.log(`price is ${price}`);
    return parseFloat(price);
  }

  return (
    <>
      <p>Select a date between {data ? data[0].date : ""} and {" "}
        {data ? data[data.length - 1].date : ""}</p>
      The stock price for Apple Computer on{" "}
      <DatePicker
        defaultValue={dayjs(defaultDate, dateFormat)}
        minDate={dayjs(minDate, dateFormat)}
        maxDate={dayjs(maxDate, dateFormat)}
        onChange={(date, dateString) => {
          console.log("onChange(): dateString");
          console.log(dateString);
          const targetDate = dayjs(dateString as string);
          // '[]' includes both start and end dates
          if (targetDate.isBetween(dayjs(minDate), dayjs(maxDate), 'day', '[]')) {
            setQueryDate(targetDate);
          }
        }}
      />{" "}
      is {price}.

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
