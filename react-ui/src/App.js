import React, { Component } from 'react';
import Promise from 'bluebird';
import RatingTable from './RatingTable.js';
import logo from './logo.svg';
import _ from 'lodash';
import './App.css';
import ratingPredictor from './ratings';

const makeDefaultData = () => (
  _.range(50).map(i => ({
    name: 'scott_wu',
    oldRating: -1 + i * 100,
    newRating: 2000 + i * 50,
    deltaRating: 200,
  }))
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      //data: makeDefaultData(),
      loading: true,
      round: '17247',
    };
  }

  componentDidMount() {
    this.update();
  }

  // TODO move this logic to a RatingTableContainer component?
  update() {
    const round = this.state.round;
    const apiServer = process.env.REACT_APP_API_SERVER || ""
    console.log(apiServer);
    return fetch(`${apiServer}/api/round/${round}`)
      .then(r => r.json())
      .then(roundData => {
        console.log('got roundData', roundData);
        const users = roundData.map(({userName}) => userName);
        Promise.map(users, user => (
          fetch(`${apiServer}/api/user/${user}`)
          .then(r => r.json())
        ))
        .then(userData => {
          console.log('got userData', userData);
          const data = ratingPredictor(roundData, userData);
          this.setState({
            data,
            loading: false,
          })
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">2018 TCO Algorithm Wilcard Fun Round</h1>
        </header>
        {this.state.loading ? "Loading data..." : <RatingTable data={this.state.data} />}
      </div>
    );
  }
}

export default App;
