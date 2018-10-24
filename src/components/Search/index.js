// eslint-disable-next-line
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//在类组件中可以使用this来访问ref引用的DOM元素实现聚焦功能。
class Search extends Component{
  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }

  render(){
    const {value, onChange, onSubmit, children} = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} ref={(node) =>this.input = node}/>
        <button type="submit">{children}</button>
      </form>
    )
  }
}

//在无状态组件中，可以这样获取ref引用：
// const Search = ({ value, onChange, onSubmit, children }) => {
//   let input;
//   return (
//     <form onSubmit={onSubmit}>
//       <input type="text" value={value} onChange={onChange} ref={(node) => input = node} />
//       <button type="submit">{children}</button>
//     </form>
//   )
// }

export default Search;

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.string
}
