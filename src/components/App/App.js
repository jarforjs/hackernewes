import React, { Component } from 'react';
import './App.css';
import Button from '../Button';
import Search from '../Search';
import Table from '../Table';
import Loading from '../Loading';
import { sortBy } from 'lodash';
import BasicSvg, { Logo, LinePattern, HeroPattern } from '../SVG/svg';
import logo from '../SVG/logo.svg';
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

const withLoading = (Component) => ({ isLoading, ...rest }) => isLoading ? <Loading /> : <Component {...rest} />

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

const withInfiniteScroll = (Component) =>
	class WithInfiniteScroll extends Component {
		componentDidMount () {
			window.addEventListener('scroll', this.onScroll, false)
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.onScroll, false)
		}

		onScroll = () => {
			const { onFetchSearchTopStories, page, searchKey, list } = this.props
			// innerHeight 浏览器可见高度
			// scrollY 垂直方向已经滚去的像素值
			// offsetHeight 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数
			if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && list.length){
				onFetchSearchTopStories(searchKey, page + 1)
			}
		}

		render() {
			return <Component {...this.props}/>
		}
	}

const withUpdateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updateHits = [
    ...oldHits,
    ...hits
  ]

  return {
    results: {
      ...results,
      [searchKey]: { hits: updateHits, page }
    },
    isLoading: false,
  }
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
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    //第一步 使用对象形式
    //在setState中使用函数取代对象形式更新状态信息
    //如果你的setState() 方法依赖于之前的状态或者属性的话，有可能在按批次执行的期间，状态或者属性的值就已经被改变了。
    // const { searchKey, results } = this.state;

    // const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    // const updateHits = [
    //   ...oldHits,
    //   ...hits
    // ]

    // this.setState({
    //   results: {
    //     ...results,
    //     [searchKey]: { hits: updateHits, page }
    //   },
    //   isLoading: false,
    // })

    //第二步 使用setState的第二种形式：函数形式
    //你从state 变量中提取了一些值，但是更新状态时异步地依赖于之前的状态。现在你可以使用函数参数的形式来防止脏状态信息造成的bug。
    // this.setState(prevState => {
    //   const { searchKey, results } = prevState;

    //   const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    //   const updateHits = [
    //     ...oldHits,
    //     ...hits
    //   ]

    //   return {
    //     results: {
    //       ...results,
    //       [searchKey]: { hits: updateHits, page }
    //     },
    //     isLoading: false,
    //   }
    // })

    //第三步 提取函数
    this.setState(withUpdateSearchTopStoriesState(hits, page));
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

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { results, searchTerm, searchKey, error, isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    // if(!result){return null;}
    // if(error){
    //   return <p>Something went wrong.</p>
    // }

    return (
      <div className="page">

        <HeroPattern pttrn={'topography-pattern'}>
          <div>
            <h1 className="tweet-wall_headline">
              What People Are Saying
            </h1>
            {/* <TweetWall tweetsIds={TWEET_IDS} /> */}
          </div>
        </HeroPattern>
        <img src={logo} className="logo" alt="logo" />
        <LinePattern />
        <BasicSvg />
        <Logo />
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
          error ? <div className="interactions"><p>Something went wrong.</p></div> : <Table list={list} SORTS={SORTS} onDismiss={this.onDismiss} onFetchSearchTopStories={this.fetchSearchTopStories} searchKey={searchKey} page={page} />
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
