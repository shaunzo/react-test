import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = {
   candidates: [],
   filteredCandidates: [],
   isLoaded: false,
   errorMessage: null,
   sort: null,
   filter: null 
}

function reducer(state=initialState, action) {
   switch (action.type) {
       case "FETCHED_DATA":
           const candidatesFetched = action.payload.data.map(x => ({
               name: x.name,
               email: x.email,
               age: x.birth_date,
               experience: x.year_of_experience,
               positionApplied: x.position_applied,
               dateOfApplication: x.application_date,
               statusOfApplication: x.status
           }))
          
           return {
               candidates: candidatesFetched,
               filteredCandidates: candidatesFetched,
               isLoaded: true,
               errorMessage: null,
               sort: null,
               filter: null
           };

       case "ERROR_FETCHING_DATA":
           return {
               ...state,
               candidates: [],
               isLoaded: true,
               errorMessage: action.payload
           }

       case "SORT_CANDIDATES":
           console.log('SORT_CANDIDATES', state);
           let sort = action.payload;
           let result = null;
           let data = [...state.filteredCandidates];
          
           if(action.payload === 'positionApplied') {
               result = data.sort((a,b) => (a.positionApplied > b.positionApplied) ? 1 : -1);
               sort='positionApplied';
        
             } else if(action.payload === 'experience') {
                 result = data.sort((a,b) => (a.experience> b.experience) ? 1 : -1);
                 sort='experience';
        
             } else if(action.payload === 'dateOfApplication') {
               result = data.sort((a,b) => (a.dateOfApplication> b.dateOfApplication) ? 1 : -1);
               result.reverse();
               sort='dateOfApplication';
              
             }

           return {
               ...state,
               filteredCandidates: result,
               sort: sort
           }

       case "RESET_FILTERS":
           console.log('RESET_FILTERS', state);
           return {
               ...state,
               filteredCandidates: state.candidates,
               sort: null,
               filter: null,
           };

       case "UDATE_URL_QUERY_STRINGS":
           return {
               ...state,
               sort: action.payload.sort,
               filter: action.payload.filter
           }

       case "FILTERED_CANDIDATES":

           let filteredData = [...state.candidates];
           let filter = action.payload;

           if(filter !== null) {
           console.log('FILTER IS NOT NULL', filter);
           let filteredResult = [...filteredData.filter((item) => {
               const result = item.name.includes(filter) | item.statusOfApplication.includes(filter) | item.positionApplied.includes(filter)
               return result;
           })]
           filteredData = filteredResult;
           } else if (filter === null) {
           console.log('FILTER IS NULL!!!!!');
           filteredData = [...state.candidates];
           }
          
           // if(this.state.sort) {
           // this.sortData(this.state.sort, data);
           // }

           return {
               ...state,
               filteredCandidates: filteredData ,
               filter: action.payload

           }
      
       default:
           return state;
   }
}

const store = createStore(reducer);

// store.dispatch({ type: "FETCH_DATA"})

ReactDOM.render(
   <Provider store={store}>
       <App />
   </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
