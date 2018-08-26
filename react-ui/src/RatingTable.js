import React, { Component } from 'react';
import ReactTable from 'react-table';
import RatingIcon, { RatingText } from './RatingIcon';
import 'react-table/react-table.css';
import './RatingTable.css';

export default class RatingTable extends Component {
  render() {
    const { data } = this.props;

    const getProfileLink = name => `https://www.topcoder.com/members/${encodeURIComponent(name)}/details/?track=DATA_SCIENCE&subTrack=SRM`

    const ratingDisplay = rating => rating < 0 ? "-" : rating
    const deltaDisplay = delta => delta > 0 ? "+" + delta : delta

    const columns = [{
      id: 'name',
      Header: 'Name',
      accessor: d => d,
      Cell: props => (
        <span className="username">
          <a href={getProfileLink(props.value.name)}>
            <RatingIcon rating={props.value.oldRating} value={props.value.name} showBubble={true} />
          </a>
        </span>
      ),
    }, {
      id: 'delta',
      Header: 'Delta',
      accessor: d => d,
      Cell: props => (
        <span className="delta">
          {props.value.oldRating < 0 || props.value.newRating < 0 ? "-" : deltaDisplay(props.value.newRating - props.value.oldRating)}
        </span>
      )
    }, {
      id: 'oldRating',
      Header: 'Old Rating',
      accessor: d => d,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value.oldRating} value={ratingDisplay(props.value.oldRating)} showBubble={true}/>
        </span>
      )
    }, {
      id: 'newRating',
      Header: 'New Rating',
      accessor: d => d,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value.oldRating} value={ratingDisplay(props.value.newRating)} showBubble={true}/>
        </span>
      )
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
