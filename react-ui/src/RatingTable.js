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
            <RatingIcon rating={props.value.oldRating} />
            <RatingText rating={props.value.oldRating} value={props.value.name} />
          </a>
        </span>
      ),
    }, {
      Header: 'Old Rating',
      accessor: 'oldRating',
    }, {
      Header: 'New Rating',
      accessor: 'newRating',
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
