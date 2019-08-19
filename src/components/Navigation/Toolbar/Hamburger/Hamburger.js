import React, { useState } from 'react';

import classes from './Hamburger.css';

const hamburger = (props) => (
  <div
    className={classes.Hamburger}
    onClick={props.clicked}
    >
    <span className={classes.TopBar}></span>
    <span className={classes.MiddleBar}></span>
    <span className={classes.BottomBar}></span>
  </div>
);

export default hamburger;
