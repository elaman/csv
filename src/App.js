import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import './App.css';
import MyBarChart from "./MyBarChart";

function App() {
  const inputRef = useRef(null);

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("weekly");
  const [files, setFiles] = useState([]);

  const onModeChange = (e) => {
    setMode(e.target.value);
  };

  const onParse = () => {
    if (inputRef.current.files.length === 0) {
      return;
    }
    if (files.findIndex((file) => file.name === inputRef.current.files[0].name) !== -1) {
      alert("File already exists");
      return;
    }

    Papa.parse(inputRef.current.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function ({ data }) {
        const sortedData = data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        setFiles((files) => [...files, { name: inputRef.current.files[0].name, data: sortedData }]);
      },
    });
  };

  useEffect(() => {
    let startDate = new Date();
    const endDate = new Date();
    files.forEach(({ data }) => {
      if (new Date(data[0].Date) < startDate) {
        startDate = new Date(data[0].Date);
      }
    });

    const dataByYears = [];
    while (startDate <= endDate) {
      const year = startDate.getFullYear();

      if (mode === "weekly") {
        if (!dataByYears[year]) {
          dataByYears[year] = {};
        }

        const week = Math.ceil(((startDate - new Date(year, 0, 1)) / 86400000 + 1) / 7);
        if (!dataByYears[year][week]) {
          dataByYears[year][week] = { label: `W${week}-Y${year}`, amount: 0 };
        }

        startDate.setDate(startDate.getDate() + 7);
      }
      else if (mode === "monthly") {
        if (!dataByYears[year]) {
          dataByYears[year] = {};
        }

        const month = startDate.getMonth();
        if (!dataByYears[year][month]) {
          dataByYears[year][month] = { label: `M${month}-Y${year}`, amount: 0 };
        }

        startDate.setMonth(startDate.getMonth() + 1);
      }
      else if (mode === "yearly") {
        if (!dataByYears[year]) {
          dataByYears[year] = { label: `Y${year}`, amount: 0 };
        }

        startDate.setFullYear(startDate.getFullYear() + 1);
      }
    }

    files.forEach(({ data }) => {
      data.forEach((item) => {
        const d = new Date(item.Date);
        const year = d.getFullYear();

        if (mode === "weekly") {
          const week = Math.ceil(((d - new Date(year, 0, 1)) / 86400000 + 1) / 7);

          if (dataByYears[year] && dataByYears[year][week]) {
            dataByYears[year][week].amount += +item.Amount;
          }
        }
        else if (mode === "monthly") {
          const month = d.getMonth();

          if (dataByYears[year] && dataByYears[year][month]) {
            dataByYears[year][month].amount += +item.Amount;
          }
        }
        else if (mode === "yearly") {
          if (dataByYears[year]) {
            dataByYears[year].amount += +item.Amount;
          }
        }
      });
    });

    let chartData = [];
    if (mode === "weekly" || mode === "monthly") {
      chartData = Object.values(dataByYears).flatMap((yearData) => Object.values(yearData));
    }
    else if (mode === "yearly") {
      chartData = Object.values(dataByYears);
    }
    setData(chartData);
  }, [files, mode]);

  const output = <MyBarChart data={data} />

  return (
    <div className="App">
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <button onClick={onParse}>Parse</button>

      <select onChange={onModeChange} value={mode}>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      {output}
    </div>
  );
}

export default App;
