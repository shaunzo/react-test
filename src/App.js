import React from 'react';
import './App.css';
import DataTable from './components/data-table';

function App() {

 const tableHeaders = ['Name', 'Email', 'Age', 'Years of experience', 'Position applied', 'Date of application', 'Status of application'];
 let tableCells = ['-', '-', '-', '-', '-', '-', '-'];
  return (
   <div className="App">   
     <DataTable headers={tableHeaders} cells={tableCells} />
   </div>
 );
}

export default App;
