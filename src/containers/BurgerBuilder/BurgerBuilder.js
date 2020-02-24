/* eslint-disable */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

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
      ingredients: null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: false
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

  componentDidMount() {
    axios.get("https://react-burger-builder-652f2.firebaseio.com/ingredents.json")
      .then(response => {
        if (!response.data) {
          return this.setState({error: true});
        }

        this.setState({ingredients: response.data});
      })
      .catch(error => {
        console.log("Error setting ingredients from Firebase", error);
        this.setState({error: true});
      })
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    this.setState({
      loading: true
    });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.price,
      customer: {
        name: "Hungry Man",
        address: {
          street: "Electric Ave",
          zipCode: "29640",
          country: "South Korea"
        },
        email: "hungry@man.com"
      },
      deliveryMethod: "expedited"
    }

    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
      });
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
    // console.log(disabledInfo);
    
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be fetched</p> : <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <Aux>
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
      orderSummary = <OrderSummary 
        ingredients={ingredients}
        price={totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />;
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
