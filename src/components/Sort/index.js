import React from 'react';
import Button from '../Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Sort = ({ sortKey, onSort, children, activeSortKey }) =>{
	const sortClass = classNames(
		'button-inline',
		{ 'button-active': sortKey === activeSortKey }
	)

	return (
		<Button onClick={() => onSort(sortKey)} className={sortClass}>{children}</Button>
	)
}

export default Sort;

Sort.propTypes = {
	children: PropTypes.node.isRequired,
	onSort: PropTypes.func.isRequired,
	sortKey: PropTypes.string.isRequired,
	activeSortKey: PropTypes.string.isRequired,
}