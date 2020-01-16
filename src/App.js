import React, { Component } from 'react';
import './App.css';
import DataTable from './components/data-table';
import { render } from '@testing-library/react';

const tableHeaders = ['Name', 'Email', 'Age', 'Years of experience', 'Position applied', 'Date of application', 'Status of application'];

class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
     candidates: [],
     isLoaded: false,
     errorMessage: null
   }
 }

 componentDidMount() {
   fetch('http://personio-fe-test.herokuapp.com/api/v1/candidates')
   .then(res => res.json())
   .then(res => {

     // Check for error
     if(res.error) {
       throw res.error.message
     } else {

       // Map returned data
       const candidates = res.data.map(x => ({
         name: x.name,
         email: x.email,
         age: x.birth_date,
         experience: x.year_of_experience,
         positionApplied: x.position_applied,
         dateOfApplication: x.application_date,
         statusOfApplication: x.status
       }));

       this.setState({
         isLoaded: true,
         candidates: candidates,
         errorMessage: null
       })
     }
     // General error handling when fetching data
   }).catch((error) => {
     this.setState({
       candidates: [],
       isLoaded: true,
       errorMessage: error
     })
   })
 }
  render() {
   // If no errors received display the table
   if(this.state.isLoaded && this.state.errorMessage === null) {
     return (
       <div className="App">   
         <DataTable headers={tableHeaders} cells={this.state.candidates} />
       </div>
     );
   // If error show error message
   } else if(this.state.isLoaded && this.state.errorMessage !== null) {
   return (
     <div className="Error">
     <h1>Sorry an error occured while fetching candidates</h1>
     <hr/>
     <p>Message from Server: {this.state.errorMessage}</p>
     </div>
     );
   } else {
     // If non of the above show loader
     return (<p>Loading data...</p>);
   }
 }
}

export default App;
