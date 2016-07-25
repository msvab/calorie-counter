import React from 'react'
import moment from 'moment'
import {createMeal, updateMeal} from '../actions'

export default class MealForm extends React.Component {
  static propTypes = {
    meal: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired
  }

  state = {
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm'),
    name: '',
    calories: ''
  }

  constructor(props) {
    super()
    if (props.meal) {
      Object.assign(this.state, props.meal)
    }
    this.handleChange = this.handleChange.bind(this)
    this.saveMeal = this.saveMeal.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async saveMeal(event) {
    event.preventDefault()

    if (this.props.meal) {
      this.props.dispatch(updateMeal(this.state, this.props.meal.id))
    } else {
      this.props.dispatch(createMeal(this.state))
    }
  }

  render() {
    return (
        <form className="form-inline">
          <input type="date" required="true" name="date" className="form-control input-sm"
                 value={this.state.date} onChange={this.handleChange} placeholder="Date"/>

          <input type="time" required="true" name="time" className="form-control input-sm"
                 value={this.state.time} onChange={this.handleChange} placeholder="Time"/>

          <input type="text" required="true" maxLength="100" name="name" className="form-control input-sm"
                 value={this.state.name} onChange={this.handleChange} placeholder="Meal"/>

          <input type="number" required="true" min="1" max="10000" name="calories" className="form-control input-sm"
                 value={this.state.calories} onChange={this.handleChange} placeholder="Calories"/>

          <button onClick={this.saveMeal} className="btn btn-default btn-sm">Save</button>
        </form>
    )
  }
}
