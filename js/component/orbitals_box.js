'use strict';

const e = React.createElement;

class OrbitalsBox extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {liked: false};
    // }

    render() {
        // if (this.state.liked) {
        //     return 'you like this';
        // }
        //
        // return e(
        //     'button',
        //     {onClick: () => this.setState({liked: true})},
        //     'Like'
        // );
        return(
            <h4>Satellites:</h4>
        )
    }
}

const domContainer = document.querySelector('#orbitals_box_container');
ReactDOM.render(e(OrbitalsBox), domContainer);