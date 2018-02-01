import React from 'react';
import { connect } from 'react-redux';
import Meal from 'UI/Meal/Meal.jsx';
import { start_meal_signup, meal_cancel, start_meal_edit, start_cancel_meal, start_edit_meal, start_edit_price, start_print } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => ({
  meal: state.meals.find(meal => meal.id === ownProps.id),
  signups: state.signups,
  user: state.user
});

export default connect(mapStateToProps, { start_meal_signup, meal_cancel, start_meal_edit, start_cancel_meal, start_edit_meal, start_edit_price, start_print })(Meal);