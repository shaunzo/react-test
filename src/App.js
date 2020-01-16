import React, { Component, useEffect } from 'react';
import { connect } from "react-redux";
import './App.css';
import DataTable from './components/data-table';
import { BrowserRouter, Link } from 'react-router-dom';

const tableHeaders = ['Name', 'Email', 'Age', 'Years of experience', 'Position applied', 'Date of application', 'Status of application'];

class App extends Component {

 urlQueries = {
   sort: null,
   filter: null
 }
  /**
  * @param  string :  positionApplied | experience | dateOfApplication
  */
 sortData(string) {
   this.props.dispatch({type: 'SORT_CANDIDATES', payload: string});
   this.urlQueries.sort = string;
 }

 /**
  * @param url string: API endpoint for ALL data
  */
 fetchCandidates(url, sort, filter) {
  
   if(!sort) {
     sort = null;
   }

   if(!filter) {
     filter = null;
   }

   this.addQueryParamtoState();
     fetch(url)
     .then(res => res.json())
     .then(res => {
       // Check for error
       if(res.error) {
         throw res.error.message
       } else {
         this.props.dispatch({type: 'FETCHED_DATA', payload: res });

         if(this.urlQueries.sort !== null) {
           this.props.dispatch({type: 'SORT_CANDIDATES', payload: this.urlQueries.sort});
         }

         if(this.urlQueries.filter !== null) {
           this.props.dispatch({type: 'FILTERED_CANDIDATES', payload: this.urlQueries.filter });
         }
       }
     }).catch((error) => {
       this.props.dispatch({type: 'ERROR_FETCHING_DATA', payload: error});
     });
 };

 filterData(value) {
   if(value === "") {
     value = null;
   }
  
   this.urlQueries.filter = value;
   this.buildUrlQuery(this.urlQueries.filter, this.urlQueries.sort);
   this.props.dispatch({type: 'FILTERED_CANDIDATES', payload: this.urlQueries.filter});

   if(this.urlQueries.sort !== null || this.props.sort !== this.urlQueries.sort) {
     this.props.dispatch({type: 'SORT_CANDIDATES', payload: this.urlQueries.sort});
   }
 }

 resetFilters() {
   this.urlQueries.sort = null;
   this.urlQueries.filter = null;
   document.getElementById('filterText').value = null;
   this.props.dispatch({type:'RESET_FILTERS'})
 }

 componentDidMount() {
   this.addQueryParamtoState();
   this.buildUrlQuery(this.urlQueries.filter, this.urlQueries.sort);
   this.fetchCandidates('http://personio-fe-test.herokuapp.com/api/v1/candidates');
 }

 componentDidUpdate() {
   this.buildUrlQuery(this.urlQueries.filter, this.urlQueries.sort);
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
   this.urlQueries = {
     sort: queryObj.sort,
     filter: queryObj.filter
   }
   this.props.dispatch({type: "UDATE_URL_QUERY_STRINGS", payload: queryObj});
 }

 buildUrlQuery(filter, sort){

   let queryString = '';

   if(sort !== null || filter !== null) {
     queryString += '?'
   };
   if(filter && !sort) {
     queryString += `filter=${filter}`;
   } else if(!filter && sort){
     queryString += `sort=${sort}`;
   } else if(filter && sort)  {
     queryString += `sort=${sort}`;
     queryString += `&filter=${filter}`;
   } else {
     queryString = '';
   };


   window.history.pushState({
     filter: filter,
     sort: sort
   }, '', window.origin + queryString);
 }

 reload() {
   window.location.href = window.location.origin;
 }
  render() {
   // If no errors received display the table
   if(this.props.isLoaded && this.props.errorMessage === null) {
     return (
       <div className="App">
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.resetFilters()}>Reset Filters</button></Link>
         </BrowserRouter>
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('positionApplied')}>Sort by Position Applied</button></Link>
         </BrowserRouter>

         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('experience')}>Sort by Years of Experience</button></Link>
         </BrowserRouter>
        
         <BrowserRouter>
           <Link to="/"><button onClick={() => this.sortData('dateOfApplication')}>Sort by Date of Application</button></Link>
         </BrowserRouter>

         <input id='filterText' onInput={(e) => this.filterData(e.target.value) } type="text" placeholder="Filter by name, status or position applied"/>
        
         <DataTable headers={tableHeaders} cells={ this.props.filteredCandidates } />
       </div>
     );
   } else if(this.props.isLoaded && this.props.errorMessage !== null) {
   return (
     <div className="Error">
       <h1>Sorry an error occured while fetching candidates</h1>
       <hr/>
       <p>Message from Server: {this.props.errorMessage}</p>

       <button onClick={() => this.reload()}>Try again</button>
     </div>
     );
   } else {
     // If non of the above show loader
     return (<p>Loading data...</p>);
   }
 }
}

const mapStateToProps = state => ({
 candidates: state.candidates,
 filteredCandidates: state.filteredCandidates,
 isLoaded: state.isLoaded,
 errorMessage: state.errorMessage,
 sort: state.sort,
 filter: state.filter
});

export default connect(mapStateToProps)(App);