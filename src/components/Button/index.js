import './index.css'
import React from 'react'
import PropTypes from 'prop-types';

const Button = ({ onClick, className = '', children }) =>
	<button onClick={onClick} className={className} type="button">{children}</button>

export default Button;

Button.propTypes = {
	onClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
}
