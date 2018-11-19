import './index.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '../Button';
import Sort from '../Sort';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    }

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;

    this.setState({ sortKey, isSortReverse })
  }

  // 提取
  // componentDidMount () {
  //   window.addEventListener('scroll', this.onScroll, false)
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onScroll, false)
  // }
  //
  // onScroll = () => {
  //   const { onFetchSearchTopStories, page, searchKey, list, isLoading } = this.props
  //   // innerHeight 浏览器可见高度
  //   // scrollY 垂直方向已经滚去的像素值
  //   // offsetHeight 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数
  //   if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && list.length && !isLoading){
  //     onFetchSearchTopStories(searchKey, page + 1)
  //   }
  // }

  render() {
    const { list, onDismiss, SORTS } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort sortKey="TITLE" onSort={this.onSort} activeSortKey={sortKey}>Title</Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort sortKey="AUTHOR" onSort={this.onSort} activeSortKey={sortKey}>Author</Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort sortKey="CREATED" onSort={this.onSort} activeSortKey={sortKey}>Created</Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort sortKey="COMMENTS" onSort={this.onSort} activeSortKey={sortKey}>Comments</Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort sortKey="POINTS" onSort={this.onSort} activeSortKey={sortKey}>Points</Sort>
          </span>
          <span style={{ width: '10%' }}>Archive</span>
        </div>
        {
          // list.filter(isSearched(pattern)).map(item=>
          // SORTS[sortKey](list).map(item =>
          reverseSortedList.map((item) => {
            // if (item.title) {
            return (
              <div key={item.objectID} className="table-row">
                <span style={{ width: '40%' }}>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span style={{ width: '15%' }}>{item.author}</span>
                <span style={{ width: '15%' }}>{moment(item.created_at).format('YYYY-MM-DD')}</span>
                <span style={{ width: '10%' }}>{item.num_comments}</span>
                <span style={{ width: '10%' }}>{item.points}</span>
                <span style={{ width: '10%' }}>
                  {/* <button onClick={} type="button">Dismiss</button> */}
                  <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
                </span>
              </div>
            )
            // }
          })
        }
      </div>
    )
  }
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
  SORTS: PropTypes.object.isRequired,
}
