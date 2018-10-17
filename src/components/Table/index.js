import './index.css';
import React from 'react';
import Button from '../Button';
import PropTypes from 'prop-types';
import Sort from '../Sort';

const Table = ({ list, onDismiss, sortKey, onSort, SORTS, isSortReverse }) =>{
  const sortedList =  SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width:'40%' }}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>Title</Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>Author</Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>Comments</Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>Points</Sort>
        </span>
        <span style={{ width: '10%' }}>Archive</span>
      </div>
      {
        // list.filter(isSearched(pattern)).map(item=>
        // SORTS[sortKey](list).map(item =>
        reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
              {/* <button onClick={} type="button">Dismiss</button> */}
              <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
            </span>
          </div>
        )
      }
    </div>
  )
}

export default Table;

// Table.PropTypes = {
//   list: PropTypes.array.isRequired,
//   onDismiss: PropTypes.func.isRequired,
// }

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  SORTS: PropTypes.object.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
}