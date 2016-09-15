import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    render() {
        const greetingMessage = 'This is a react app... have a ball!'
        return(
        <div>{greetingMessage}</div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('react-container'));


// The ES5 way
// var App = React.createClass({
//     render: function(){
//         return(
//             <div>
//               This is a react app, have fun :D
//             </div>
//        )
//     }
// });