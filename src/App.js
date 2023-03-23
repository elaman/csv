import Papa from "papaparse";
import './App.css';

function App() {
  const changeHandler = (event) => {
    if (event.target.files.length > 0) {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log(results.data)
        },
      });
    };
  }
  return (
    <div className="App">
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />
    </div>
  );
}

export default App;
