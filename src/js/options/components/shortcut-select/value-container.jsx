import { h } from 'preact';
import PropTypes from 'prop-types';

const ValueContainer = ({ description, shortcut }) => (
  <div className="shortcut-select__value">
    {description}
    <span className="shortcut-select__key">
      {shortcut.length > 0 ? shortcut : 'not specified'}
    </span>
  </div>
);

ValueContainer.propTypes = {
  description: PropTypes.string,
  shortcut: PropTypes.string,
};

ValueContainer.defaultProps = {
  description: '',
  shortcut: '',
};

export default ValueContainer;
