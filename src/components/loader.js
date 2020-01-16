import React from 'react';

class Loader extends React.Component {

    render() {
        return (
            <div className="loader">
                <div class="lds-circle"><div></div></div>
            </div>
        )
    }
}

export default Loader;