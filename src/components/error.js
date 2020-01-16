import React from 'react';

class ErrorMessage extends React.Component {

    reload() {
        window.location.href = window.location.origin;
    }

    render() {
        return (
            <div className="error">
                <div className="error-message">
                <h1>Sorry an error occured while fetching candidates</h1>
                <hr/>
                <p>Message from Server: {this.props.errorMessage}</p>

                <button onClick={() => this.reload()}>Try again</button>
                </div>
            </div>
        )
    }
}

export default ErrorMessage;