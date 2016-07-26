import React from 'react'
import {connect} from 'react-redux'
import actions from '../actions'

class DailyCalorieCounter extends React.Component {

  showInput(event) {
    event.preventDefault()
    this.props.dispatch(actions.showEditDailyLimit())
  }

  setLimit(event) {
    event.preventDefault()
    const newLimit = +event.target.querySelector('[name=limit]').value
    this.props.dispatch(actions.setDailyLimit(this.props.currentUser.login, newLimit))
  }

  render() {
    const limitSet = !isNaN(this.props.currentUser.maxDailyCalories)
    const overLimit = limitSet ? this.props.currentUser.maxDailyCalories < this.props.meals.todaysCalories : false

    return (
        <div className="navbar-header">
          {limitSet &&
            <p className="navbar-text">
              Calories today: <span key="a" className={overLimit ? 'text-danger' : 'text-success'}><strong>{this.props.meals.todaysCalories}</strong></span>
            </p>}
          {this.props.currentUser.editLimit
              ? <div className="navbar-form navbar-left">
                  <form onSubmit={::this.setLimit}>
                    <input type="number" name="limit" defaultValue={this.props.currentUser.maxDailyCalories} className="form-control"/>
                    <button type="submit" className="btn btn-default btn-sm">Set Limit</button>
                  </form>
                </div>
              : <button className="btn btn-default navbar-btn btn-sm" onClick={::this.showInput}>
                  {limitSet ? 'Change your daily limit' : 'Set your daily limit'}
                </button>
          }

        </div>
    )
  }
}

const mapStateToProps = state => ({currentUser: state.currentUser, meals: state.meals})

export default connect(mapStateToProps)(DailyCalorieCounter)