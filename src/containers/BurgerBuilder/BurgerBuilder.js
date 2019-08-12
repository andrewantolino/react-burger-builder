/* eslint-disable */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: {
        bacon: 0,
        cheese: 0,
        meat: 0,
        salad: 0
      },
      totalPrice: 4,
      purchasable: false,
      purchasing: false
    };

    this.updatePurchaseState = (ingredients) => {
      const sum = Object.keys(ingredients)
        .map(igKey => ingredients[igKey])
        .reduce((sum, el) => sum + el, 0);
      this.setState({ purchasable: sum > 0 });
    };

    this.addIngredientHandler = (type) => {
      const { ingredients, totalPrice } = this.state;
      const oldCount = ingredients[type];
      const updatedCount = oldCount + 1;
      const updatedIngredients = {
        ...ingredients
      };
      updatedIngredients[type] = updatedCount;
      const priceAddition = INGREDIENT_PRICES[type];
      const oldPrice = totalPrice;
      const newPrice = oldPrice + priceAddition;
      console.log('[BurgerBuilder.js] updatedIngredients', updatedIngredients);
      this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
      this.updatePurchaseState(updatedIngredients);
    };

    this.removeIngredientHandler = (type) => {
      const { ingredients, totalPrice } = this.state;
      const oldCount = ingredients[type];
      if (oldCount <= 0) {
        return false;
      }
      const updatedCount = oldCount - 1;
      const updatedIngredients = {
        ...ingredients
      };
      updatedIngredients[type] = updatedCount;
      const priceDeduction = INGREDIENT_PRICES[type];
      const oldPrice = totalPrice;
      const newPrice = oldPrice - priceDeduction;
      console.log('[BurgerBuilder.js] updatedIngredients', updatedIngredients);
      this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
      this.updatePurchaseState(updatedIngredients);
    };
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  render() {
    const { ingredients, totalPrice, purchasable } = this.state;
    let disabledInfo = {
      ...ingredients
    };

    // for (const key in disabledInfo) {
    //   disabledInfo[key] = disabledInfo[key] <= 0;
    // }

    disabledInfo = Object.keys(disabledInfo).map(ingredient => disabledInfo[ingredient] <= 0);
    console.log(disabledInfo);

    return (
      <Aux>
        <Modal show={this.state.purchasing}>
          <OrderSummary ingredients={ingredients} />
        </Modal>
        <Burger ingredients={ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          purchasable={purchasable}
          ordered={this.purchaseHandler}
          price={totalPrice}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
