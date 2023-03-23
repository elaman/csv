import Papa from "papaparse";
import { useRef } from "react";
import './App.css';

function App() {
  const inputRef = useRef(null);

  const onParse = () => {
    if (inputRef.current.files.length > 0) {
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

          sortedData.forEach(({ date, amount }) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const week = Math.ceil(((d - new Date(year, 0, 1)) / 86400000 + 1) / 7);

            if (weeklyData[year] && weeklyData[year][week]) {
              weeklyData[year][week].amount += amount;
            }
          });

          const data = Object.values(weeklyData).flatMap((yearData) => Object.values(yearData));

          console.log(data);
        },
      });
    };
  }
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
    </div>
  );
}

export default App;
