/* eslint-disable arrow-body-style */
import React from 'react';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const burger = (props) => {
  const { ingredients } = props;
  // console.log(ingredients);
  let transformedIngredients = Object.keys(ingredients)
    .map((igKey) => {
      return [...Array(ingredients[igKey])].map((_, i) => {
        // eslint-disable-next-line react/no-array-index-key
        return <BurgerIngredient key={igKey + i} type={igKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  // console.log(transformedIngredients);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please select some ingredients</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;
