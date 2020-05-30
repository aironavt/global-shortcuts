import { h } from 'preact';
import PropTypes from 'prop-types';

function Checkbox({ label = '', description = '', ...props }) {
  const isText = label || description;
  const labelTag = label ? <span className="checkbox__label">{label}</span> : null;
  const descriptionTag = description ? <span className="checkbox__description">{description}</span> : null;

  return (
    <label className="checkbox">
      <input
        className="checkbox__input"
        type="checkbox"
        {...props}
      />
      <span className="checkbox__box" />
      {
        isText ? (
          <span className="checkbox__text">
            {labelTag}
            {descriptionTag}
          </span>
        ) : null
      }
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
};

Checkbox.defaultProps = {
  label: '',
  description: '',
};

export default Checkbox;
