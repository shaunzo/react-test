import React from 'react';

class DataTable extends React.Component {

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {this.props.headers.map((header, i) => {
                                return (<th key={i}>{header}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.cells.map((cell, i) => {
                            return (
                                <tr key={i}>
                                    <td>{cell.name}</td>
                                    <td>{cell.email}</td>
                                    <td>{cell.age}</td>
                                    <td>{cell.experience}</td>
                                    <td>{cell.positionApplied}</td>
                                    <td>{cell.dateOfApplication}</td>
                                    <td>{cell.statusOfApplication}</td>
                                </tr>
                            )
                            })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DataTable;