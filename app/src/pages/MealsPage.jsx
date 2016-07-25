'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {fetchMeals, deleteMeal, toggleCreateMeal, showEditMeal} from '../actions'
import MealFilter from '../components/MealFilter'
import MealForm from '../components/MealForm'
import Auth from '../auth'

class MealsPage extends React.Component {

  toggleForm() {
    this.props.dispatch(toggleCreateMeal())
  }

  editMeal(id) {
    this.props.dispatch(showEditMeal(id))
  }

  deleteMeal(id) {
    this.props.dispatch(deleteMeal(id));
  }

  componentDidMount() {
    this.props.dispatch(fetchMeals());
  }

  render() {
    return (
        <div className="container">
          <MealFilter dispatch={this.props.dispatch} meals={this.props.meals.list}/>
          <br/>
          {this.props.meals.create
              ? <MealForm dispatch={this.props.dispatch}/>
              : <button onClick={::this.toggleForm} className="btn btn-default pull-right btn-sm">Add Meal</button>}
          <br/>
          <table className="table table-condensed">
            <thead>
              <tr>
                <th width="150">Date</th>
                <th>Meal</th>
                <th width="100">Calories</th>
                {Auth.isAdmin() && <th>User</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.meals.filteredList.map(meal => {
                return (
                    <tr key={meal.id}>
                      {this.props.meals.edit === meal.id
                          ? <td colSpan={Auth.isAdmin() ? 5 : 4}>
                              <MealForm meal={meal} dispatch={this.props.dispatch} meals={this.props.meals.list}/>
                            </td>
                          : [
                            <td key="date">{meal.date} {meal.time}</td>,
                            <td key="meal">{meal.name}</td>,
                            <td key="calories">{meal.calories}</td>,
                            Auth.isAdmin() ? <td key="login">{meal.login}</td> : null,
                            <td key="actions">
                              <button onClick={this.editMeal.bind(this, meal.id)} className="btn btn-default btn-sm">Edit</button>
                              <button onClick={this.deleteMeal.bind(this, meal.id)} className="btn btn-default btn-sm">Delete</button>
                            </td>
                          ]
                      }
                    </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {meals: state.meals};
}

export default connect(mapStateToProps)(MealsPage)