import { h } from 'preact';
import PropTypes from 'prop-types';

function FormFieldErrors({ componentErrors }) {
  const isShowError = componentErrors.length > 0;

  return (
    isShowError ? (
      <div className="form-field-errors">
        {
          componentErrors.map(({ message }) => (
            <div className="form-field-errors__error">{message}</div>
          ))
        }
      </div>
    ) : null
  );
}

FormFieldErrors.propTypes = {
  componentErrors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  ),
};

FormFieldErrors.defaultProps = {
  componentErrors: [],
};

export default FormFieldErrors;
