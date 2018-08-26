import React, { Component } from 'react';
import ReactTable from 'react-table';
import RatingIcon, { RatingText } from './RatingIcon';
import 'react-table/react-table.css';
import './RatingTable.css';

export default class RatingTable extends Component {
  render() {
    const { data } = this.props;

    let getProfileLink = name => `https://www.topcoder.com/members/${encodeURIComponent(name)}/details/?track=DATA_SCIENCE&subTrack=SRM`

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
          {props.value.newRating > props.value.oldRating ? "+" + (props.value.newRating - props.value.oldRating) : props.value.newRating - props.value.oldRating}
        </span>
      )
    }, {
      id: 'oldRating',
      Header: 'Old Rating',
      accessor: d => d,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value.oldRating} value={props.value.oldRating < 0 ? "-" : props.value.oldRating} showBubble={true}/>
        </span>
      )
    }, {
      id: 'newRating',
      Header: 'New Rating',
      accessor: d => d,
      Cell: props => (
        <span className="rating">
          <RatingIcon rating={props.value.newRating} value={props.value.newRating < 0 ? "-" : props.value.newRating} showBubble={true}/>
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
