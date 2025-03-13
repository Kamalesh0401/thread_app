import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/button.css';

const Button = ({ variant, className, onClick, children }) => {
    const buttonClass = `button ${variant} ${className}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            {children}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

Button.defaultProps = {
    className: ''
};

export default Button;
