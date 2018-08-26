import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './RatingTable.css';

export default class RatingTable extends Component {
  render() {
    const { data } = this.props;
    const columns = [{
      Header: 'Name',
      accessor: 'name',
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
