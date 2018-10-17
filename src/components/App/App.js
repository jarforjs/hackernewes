import React, { Component } from 'react';
import './App.css';
import Button from '../Button';
import Search from '../Search';
import Table from '../Table';
import Loading from '../Loading';
import { sortBy } from 'lodash';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants';

// import developer, { firstname, lastname} from '../../file';
// console.log(developer,'de');
// console.log(firstname, lastname)

// function withFoo(Component){
//   return function(props){
//     return <Component { ...props } />
//   }
// }

// const withFooo = (Component) => (props) =>
//   <Component { ...props } />

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />


const ButtonWithLoading = withLoading(Button);

//es5
// function isSearched(searchTerm){
//   return function(item){
//       return item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   }
// }

//es6
//不用了，过滤时会直接向服务器发起请求
// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updateHits = [
      ...oldHits,
      ...hits
    ]

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updateHits, page }
      },
      isLoading: false,
    })
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({ error: e }));
  }

  onDismiss(id) {
    // const list = this.state.list.filter((item)=>{
    //   return item.objectID!==id;
    // })

    // function isNotId(item){
    //   return item.objectID!==id;
    // }

    //这样缺少可读性
    //const list = this.state.list.filter(item => item.objectID !== id);

    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    //抽取函数并将其传递给filter函数
    const isNotId = item => item.objectID !== id;

    // const updateHits = this.state.result.hits.filter(isNotId);
    const updateHits = hits.filter(isNotId);

    this.setState({
      // result:Object.assign({},this.state.result,{hits:updateHits})
      // result:{...this.state.result,hits:updateHits}
      results: {
        ...results,
        [searchKey]: { hits: updateHits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }

    event.preventDefault();
  }

  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;

    this.setState({ sortKey, isSortReverse })
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { results, searchTerm, searchKey, error, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    // if(!result){return null;}
    // if(error){
    //   return <p>Something went wrong.</p>
    // }

    return (
      <div className="page">
        {/* <form>
          <input type="text" value={searchTerm} onChange={this.onSearchChange}/>
        </form>
        {
          list.filter(isSearched(searchTerm)).map(item=>
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button onClick={()=>this.onDismiss(item.objectID)} type="button">Dismiss</button>
              </span>
            </div>
          )
        } */}
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {
          error ? <div className="interactions"><p>Something went wrong.</p></div> : <Table list={list} sortKey={sortKey} onSort={this.onSort} SORTS={SORTS} onDismiss={this.onDismiss} isSortReverse={isSortReverse} />
        }
        <div className="interactions">
          {/* {
            isLoading ? <Loading /> : <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
          } */}
          <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

//jest测试
export {
  Button,
  Search,
  Table,
}