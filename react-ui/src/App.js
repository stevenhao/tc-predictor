import React, { Component } from 'react';
import Promise from 'bluebird';
import RatingTable from './RatingTable.js';
import logo from './logo.svg';
import _ from 'lodash';
import './App.css';
import ratingPredictor from './ratings';

const makeDefaultData = () => (
  _.range(10).map(i => ({
    name: 'Scott Wu',
    oldRating: 1100 + i * 100,
    newRating: 2000 + i * 50,
    deltaRating: 200,
  }))
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: makeDefaultData(),
      loading: false,
      round: '17247',
    };
  }

  componentDidMount() {
    this.update();
  }

  // TODO move this logic to a RatingTableContainer component?
  update() {
    const round = this.state.round;
    return fetch(`http://localhost:5000/api/round/${round}`)
      .then(r => r.json())
      .then(roundData => {
        console.log('got roundData', roundData);
        const users = roundData.map(({userName}) => userName);
        Promise.map(users, user => (
          fetch(`http://localhost:5000/api/user/${user}`)
          .then(r => r.json())
        ))
        .then(userData => {
          console.log('got userData', userData);
          const data = ratingPredictor(roundData, userData);
          this.setState({
            data,
          })
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <RatingTable data={this.state.data} />
      </div>
    );
  }
}

export default App;
