import Papa from "papaparse";
import { useRef, useState } from "react";
import './App.css';
import MyBarChart from "./MyBarChart";

function App() {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);

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
      complete: function (results) {
        const sortedData = results.data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        const startDate = new Date(sortedData[0].Date);
        const endDate = new Date();

        const weeklyData = {};

        while (startDate <= endDate) {
          const year = startDate.getFullYear();
          const week = Math.ceil(((startDate - new Date(year, 0, 1)) / 86400000 + 1) / 7);

          if (!weeklyData[year]) {
            weeklyData[year] = {};
          }

          if (!weeklyData[year][week]) {
            weeklyData[year][week] = { week: `W${week}-Y${year}`, amount: 0 };
          }

          startDate.setDate(startDate.getDate() + 7);
        }

        console.log(weeklyData);

        sortedData.forEach((item) => {
          const d = new Date(item.Date);
          const year = d.getFullYear();
          const week = Math.ceil(((d - new Date(year, 0, 1)) / 86400000 + 1) / 7);

          if (weeklyData[year] && weeklyData[year][week]) {
            weeklyData[year][week].amount += +item.Amount;
          }
        });

        const data = Object.values(weeklyData).flatMap((yearData) => Object.values(yearData));

        setFiles((files) => [...files, { name: inputRef.current.files[0].name, data }]);
      },
    });
  };

  const output = files.map((file) => (
    <MyBarChart key={file.name} data={file.data} />
  ));

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

      {output}
    </div>
  );
}

export default App;
