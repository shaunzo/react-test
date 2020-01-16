import React, { Component } from 'react';
import './App.css';
import DataTable from './components/data-table';

const tableHeaders = ['No', 'Name', 'Email', 'Age', 'Years of experience', 'Position applied', 'Date of application', 'Status of application'];

class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
     candidates: [],
     isLoaded: false,
     errorMessage: null,
     sort: null
   }
 }

 /**
  * @param  string :  positionApplied | experience | dateOfApplication
  * @param data : array: the array of data to sort
  */
 sortData(string, data) {
   let result = null;

   if(string === 'positionApplied') {
     console.log('Sort data - Position Applied!');

     result = this.state.candidates.sort((a,b) => (a.positionApplied > b.positionApplied) ? 1 : -1);
     this.setState(prevState => ({
       candidates: result,
       sort: 'positionApplied'
     }))

   } else if(string === 'experience') {
       result = this.state.candidates.sort((a,b) => (a.experience> b.experience) ? 1 : -1);
       this.setState(prevState => ({
         candidates: result,
         sort: 'experience'
       }));

   } else if(string === 'dateOfApplication') {
     result = this.state.candidates.sort((a,b) => (a.dateOfApplication> b.dateOfApplication) ? 1 : -1);
     result.reverse();
     this.setState(prevState => ({
       candidates: result,
       sort: 'dateOfApplication'
     }));
   }
 }

 /**
  *
  * @param url string: API endpoint for ALL data
  */
 fetchCandidates(url) {
     fetch(url)
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

 componentDidMount() {
   this.fetchCandidates('http://personio-fe-test.herokuapp.com/api/v1/candidates');
 }

 componentDidUpdate() {
   console.log('Component Updated', this.state);
 }
  render() {
   // If no errors received display the table
   if(this.state.isLoaded && this.state.errorMessage === null) {
     return (
       <div className="App">
         <button onClick={() => this.sortData('positionApplied', this.state.candidates)}>Sort by Position Applied</button>
         <button onClick={() => this.sortData('experience', this.state.candidates)}>Sort by Years of Experience</button>
         <button onClick={() => this.sortData('dateOfApplication', this.state.candidates)}>Sort by Date of Application</button>
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
