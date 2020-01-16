class DataTable extends React.Component {
    constructor(props) {
        super(props);
    }
 
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
                        <tr>
                            {this.props.cells.map((cell, i) => {
                                return (<td key={i}>{cell}</td>)
                             })}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
 }
 
 export default DataTable;