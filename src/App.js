import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import classes from './App.css';

class App extends Component {
  state = {
    show: true
  };

  render() {
    return (
      <div className={classes.App}>
        <Layout>
          { this.state.show ? <BurgerBuilder /> : null }
        </Layout>
      </div>
    );
  }
}

export default App;
