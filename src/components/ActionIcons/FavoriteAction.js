import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

export const FavoriteAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.favorite" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <BsHeart size={20} />
    </Button>
  </OverlayTrigger>
);

export const NonFavoriteAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.nonFavorite" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <BsHeartFill size={20} />
    </Button>
  </OverlayTrigger>
);

FavoriteAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

NonFavoriteAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
