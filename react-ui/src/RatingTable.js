import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './RatingTable.css';

export default class RatingTable extends Component {
  render() {
    const data = [{
      name: 'Scott Wu',
      oldRating: 3100,
      newRating: 2000,
    }]
    for (let i = 0; i < 100; i++) {
      data.push({
        name: 'Scott Wu' + i,
        oldRating: 3100 + i,
        newRating: 2000 + i,
      })
    }

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
        data={data}
        columns={columns}
        defaultPageSize={data.length}
        showPagination={false}
      />
    );
  }
}
