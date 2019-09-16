import PropTypes from 'prop-types';

const ValueContainer = ({ name = '' }) => name;

ValueContainer.propTypes = {
  name: PropTypes.string,
};

ValueContainer.defaultProps = {
  name: '',
};

export default ValueContainer;
