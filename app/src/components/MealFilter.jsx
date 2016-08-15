import React from 'react'
import moment from 'moment'
import {filterMeals} from '../actions/meals'

const toDate = str => str ? moment(str, 'YYYY-MM-DD') : null
const toTime = str => str ? moment(str, 'HH:mm') : null

export default class MealFilter extends React.Component {
  static defaultProps = {
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null
  }

  filter(event) {
    event.preventDefault()

    const filter = {
      fromDate: toDate(event.target.querySelector('[name=fromDate]').value),
      toDate: toDate(event.target.querySelector('[name=toDate]').value),
      fromTime: toTime(event.target.querySelector('[name=fromTime]').value),
      toTime: toTime(event.target.querySelector('[name=toTime]').value)
    }
    this.props.dispatch(filterMeals(this.props.meals, filter))
  }

  clearFilter(event) {
    event.preventDefault()

    this.props.dispatch(filterMeals(this.props.meals, MealFilter.defaultProps))
  }

  render() {
    return (
        <form onSubmit={::this.filter} className="form-inline">
          <h3>Filter meals</h3>
          <div className="form-group">
            <label htmlFor="fromDate">By date from</label>
            <input type="date" name="fromDate" defaultValue={this.props.fromDate} className="form-control input-sm"/>
            <label htmlFor="toDate">to</label>
            <input type="date" name="toDate" defaultValue={this.props.toDate} className="form-control input-sm"/>
          </div>

          <div className="form-group pull-right">
            <label htmlFor="fromTime">By time from</label>
            <input type="time" name="fromTime" defaultValue={this.props.fromTime} className="form-control input-sm"/>
            <label htmlFor="toTime">to</label>
            <input type="time" name="toTime" defaultValue={this.props.toTime} className="form-control input-sm"/>
          </div>

          <br/>
          <br/>

          <div className="form-group pull-right">
            <button type="submit" className="btn btn-primary btn-sm">Filter</button>
            <a href="#" onClick={::this.clearFilter} className="btn btn-default btn-sm">Clear</a>
          </div>

          <div className="clearfix"/>
        </form>
    )
  }
}