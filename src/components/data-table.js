import React from 'react';

class DataTable extends React.Component {
   constructor(props) {
       super(props);
       this.state = {}
   }

   render() {
       return (
           <div>
               <table>
                   <thead>
                       <th>Name</th>
                       <th>Email</th>
                       <th>Age</th>
                       <th>Years of experience</th>
                       <th>Position applied</th>
                       <th>Date of application</th>
                       <th>Status of application</th>
                   </thead>

                   <tbody>
                       <td>{this.props.children}</td>
                       <td> - </td>
                       <td> - </td>
                       <td> - </td>
                       <td> - </td>
                       <td> - </td>
                       <td> - </td>
                       <td> - </td>
                   </tbody>
               </table>
               </div>
       )
   }
}

export default DataTable;