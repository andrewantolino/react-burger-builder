import React from 'react';

import Layout from './containers/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import classes from './App.css';

function App() {
  return (
    <div className={classes.App}>
      <Layout>
        <BurgerBuilder />
      </Layout>
    </div>
  );
}

export default App;
