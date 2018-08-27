import React, { Component } from 'react';
import ReactTable from 'react-table';
import RatingIcon from './RatingIcon';
import 'react-table/react-table.css';
import './RatingTable.css';

export default class RatingTable extends Component {
  render() {
    const { data } = this.props;

    const getProfileLink = name => `https://www.topcoder.com/members/${encodeURIComponent(name)}/details/?track=DATA_SCIENCE&subTrack=SRM`

    const ratingDisplay = rating => rating < 0 ? "-" : rating
    const deltaDisplay = delta => delta > 0 ? "+" + delta : delta

    const columns = [{
      Header: 'Rank',
      accessor: 'rank',
    }, {
      id: 'name',
      Header: 'Name',
      accessor: d => ({name: d.name, rating: d.oldRating}),
      Cell: props => (
        <span className="username">
          <a href={getProfileLink(props.value.name)}>
            <RatingIcon rating={props.value.rating} value={props.value.name} showBubble={true} />
          </a>
        </span>
      ),
      sortMethod: (a, b) => {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
      },
    }, {
      id: 'delta',
      Header: 'Delta',
      accessor: d => (d.oldRating < 0 || d.newRating < 0 ? null : d.newRating - d.oldRating),
      Cell: props => (
        <span className="delta">
          {props.value !== null ? deltaDisplay(props.value) : "-"}
        </span>
      ),
      sortMethod: (a, b, desc) => {
        if (a === null && b === null) return 0;
        else if (a === null) return desc ? -1 : 1;
        else if (b === null) return desc ? 1 : -1;
        else if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
      },
    }, {
      id: 'oldRating',
      Header: 'Old Rating',
      accessor: d => d.oldRating,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value} value={ratingDisplay(props.value)} showBubble={true}/>
        </span>
      )
    }, {
      id: 'newRating',
      Header: 'New Rating',
      accessor: d => d.newRating,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value} value={ratingDisplay(props.value)} showBubble={true}/>
        </span>
      )
    }, {
      Header: 'Old Volatility',
      accessor: 'oldVolatility',
    }, {
      Header: 'New Volatility',
      accessor: 'newVolatility',
    }]

    return (
      <ReactTable
        key={`${data.length}`}
        data={data}
        columns={columns}
        defaultPageSize={data.length}
        showPagination={false}
      />
    );
  }
}
