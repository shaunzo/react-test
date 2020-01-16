import React, { Component } from 'react';
import './App.css';
import DataTable from './components/data-table';
import { BrowserRouter, Link } from 'react-router-dom';

const tableHeaders = ['Name', 'Email', 'Age', 'Years of experience', 'Position applied', 'Date of application', 'Status of application'];

class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
     candidates: [],
     filteredCandidates: [],
     isLoaded: false,
     errorMessage: null,
     sort: null,
     filter: null
   }
 }

 /**
  * @param  string :  positionApplied | experience | dateOfApplication
  * @param data : array: the array of data to sort
  */
 sortData(string, data) {
   let result = null;
   let sort = null;

   if(string === 'positionApplied') {
     result = data.sort((a,b) => (a.positionApplied > b.positionApplied) ? 1 : -1);
       sort='positionApplied';

   } else if(string === 'experience') {
       result = data.sort((a,b) => (a.experience> b.experience) ? 1 : -1);
       sort='experience';

   } else if(string === 'dateOfApplication') {
     result = data.sort((a,b) => (a.dateOfApplication> b.dateOfApplication) ? 1 : -1);
     result.reverse();
     sort='dateOfApplication';
   }

   this.setState(prevState => ({
     filteredCandidates: result,
     sort: sort
   }))
 }

 /**
  * @param url string: API endpoint for ALL data
  */
 fetchCandidates(url) {
     const queries = this.addQueryParamtoState();
     fetch(url)
     .then(res => res.json())
     .then(res => {
       let candidates= null;
       // Check for error
       if(res.error) {
         throw res.error.message
       } else {

         // Map returned data
           candidates = res.data.map(x => ({
           name: x.name,
           email: x.email,
           age: x.birth_date,
           experience: x.year_of_experience,
           positionApplied: x.position_applied,
           dateOfApplication: x.application_date,
           statusOfApplication: x.status
         }));

         const filteredCandidates = [...candidates];

         this.setState({
           isLoaded: true,
           candidates: candidates,
           filteredCandidates: filteredCandidates,
           errorMessage: null,
           sort: queries.sort,
           filter: queries.filter
         })
       }
     }).then(() => {
       if(this.state.filter !== null) {
         this.filterData(this.state.filter);
       }

       if(this.state.sort !== null) {
         this.sortData(this.state.sort, this.state.filteredCandidates);
       }

     }).catch((error) => {
       this.setState({
         candidates: [],
         isLoaded: true,
         errorMessage: error
       })
     })
 };

 filterData(value) {
   let data = [...this.state.filteredCandidates];
   this.filter = value;

   if(value !== null || value !== '') {
     data = [...this.state.candidates.filter((item) => {
       const result = item.name.includes(value) | item.statusOfApplication.includes(value) | item.positionApplied.includes(value)
       return result;
     })]
   } else if ((value === '')) {
     data = [...this.state.candidates];
   }
  
   if(this.state.sort) {
     this.sortData(this.state.sort, data);
   }

   this.setState({
     filteredCandidates: data,
     filter: value
   })

   this.addQueryParamtoState();
 }

 resetFilters() {
   document.getElementById('filterText').value = null;
   let filteredCandidates = [...this.state.candidates];
   this.setState({
     filteredCandidates: filteredCandidates,
     sort: null,
     filter: null
   });
 }

 componentDidMount() {
   this.fetchCandidates('http://personio-fe-test.herokuapp.com/api/v1/candidates');
 }

 componentDidUpdate() {
   this.buildUrlQuery();
 }

 addQueryParamtoState() {
   const queryParams = document.location.search.replace('?','').split('&');
   const queriesArr = [];
   const queryObj = {sort: null, filter: null};
   queryParams.forEach(query => {
     queriesArr.push(query.split('='));
   });

   for (let i = 0; i < queriesArr.length; i++) {
     if(queriesArr[i][0] === "sort") {
       queryObj.sort = queriesArr[i][1];
     } else if(queriesArr[i][0] === "filter") {
       queryObj.filter = queriesArr[i][1];
     };
   }
   return queryObj;
 }

 buildUrlQuery(){
   let queryString = '';
   if(this.state.sort !== null || this.state.filter !== null) {
     queryString += '?'
   };
   if(this.state.filter && !this.state.sort) {
     queryString += `filter=${this.state.filter}`;
   } else if(!this.state.filter && this.state.sort){
     queryString += `sort=${this.state.sort}`;
   } else if(this.state.filter && this.state.sort)  {
     queryString += `sort=${this.state.sort}`;
     queryString += `&filter=${this.state.filter}`;
   };


   window.history.pushState({
     filter: this.state.filter,
     sort: this.state.sort
   }, '', window.origin + queryString);
 }
  render() {
   // If no errors received display the table
   if(this.state.isLoaded && this.state.errorMessage === null) {
     return (
       <div className="App">
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.resetFilters()}>Reset Filters</button></Link>
         </BrowserRouter>
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('positionApplied', this.state.filteredCandidates)}>Sort by Position Applied</button></Link>
         </BrowserRouter>

         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('experience', this.state.filteredCandidates)}>Sort by Years of Experience</button></Link>
         </BrowserRouter>
        
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('dateOfApplication', this.state.filteredCandidates)}>Sort by Date of Application</button></Link>
         </BrowserRouter>

         <input id='filterText' onInput={(e) => this.filterData(e.target.value) } type="text" placeholder="Filter by name, status or position applied"/>
        
         <DataTable headers={tableHeaders} cells={ this.state.filteredCandidates } />
       </div>
     );
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
