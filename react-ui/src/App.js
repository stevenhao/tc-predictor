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
      round: '17265',
    };
  }

  componentDidMount() {
    this.update();
  }

  // TODO move this logic to a RatingTableContainer component?
  update() {
    const round = this.state.round;
    const apiServer = process.env.REACT_APP_API_SERVER || ""
    console.log("Using apiServer", apiServer);
    return fetch(`${apiServer}/api/round/${round}`)
      .then(r => r.json())
      .then(roundData => {
        const users = roundData.map(({userName}) => userName);
        fetch(`${apiServer}/api/users`, {
          method: 'POST',
          body: JSON.stringify({
            users,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(response => response.json())
        .then(userData => {
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
          <h1 className="App-title">TCO19 Single Round Match 737</h1>
        </header>
        {this.state.loading ? "Loading data..." : <RatingTable data={this.state.data} />}
        <footer className="App-footer">
          <a href="https://github.com/stevenhao/tc-predictor">
            <div style={{height: 30, width: 30, display: 'inline-block', backgroundImage: "url(https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png)", backgroundSize: 'contain' }}/>
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
