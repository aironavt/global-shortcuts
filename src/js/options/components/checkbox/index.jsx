import { h } from 'preact';
import PropTypes from 'prop-types';

function Checkbox({ label = '', ...props }) {
  return (
    <label className="checkbox">
      <input
        className="checkbox__input"
        type="checkbox"
        {...props}
      />
      <span className="checkbox__box" />
      {
        label ? (
          <span className="checkbox__label">{label}</span>
        ) : null
      }
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
};

Checkbox.defaultProps = {
  label: '',
};

export default Checkbox;
