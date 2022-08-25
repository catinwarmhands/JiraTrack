import React from 'react';
import Switcher from "./components/Switcher/Switcher";
import "./styles/App.css"

class App extends React.Component {
  render = () => {
    return (
        <div className="App">
            <Switcher
                options={[{value: "Hello"}, {value: "Modern"}, {value: "World"}]}
            />
        </div>
    );
  }
}


export default App;
