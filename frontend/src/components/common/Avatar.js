// Avatar.js
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/avatar.css';

const Avatar = ({ src, alt, size }) => {
    const sizeClass = size === 'large' ? 'avatar-large' : 'avatar-small';
    console.log("Avatar : ", src);

    return (
        <img
            className={`avatar ${sizeClass}`}
            src={src ? src : `${process.env.PUBLIC_URL}/images/user.png`}
            alt={alt}
        />
    );
};

Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired
};

export default Avatar;
