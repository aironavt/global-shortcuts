import { h, Fragment, cloneElement } from 'preact';
import PropTypes from 'prop-types';
import { useContext } from 'preact/hooks';
import classNames from 'classnames';
import ErrorContext from './error-context';
import FormFieldErrors from './form-field-errors';

function FormField({ children, changeEvent, classNameError }) {
  const { errors, onValidate } = useContext(ErrorContext);
  const {
    name: componentName,
    className: componentClassName,
    [changeEvent]: componentChangeEvent,
  } = children.props;
  const componentErrors = errors.filter(({ fieldName }) => fieldName === componentName);
  const isShowError = componentErrors.length > 0;

  const component = cloneElement(children, {
    className: classNames(
      componentClassName, { [classNameError]: isShowError },
    ),
    [changeEvent]: (...rest) => {
      componentChangeEvent(...rest).then(() => {
        onValidate({
          fieldNames: [
            componentName,
          ],
        });
      });
    },
  });

  return (
    <Fragment>
      {component}
      <FormFieldErrors
        componentErrors={componentErrors}
      />
    </Fragment>
  );
}

FormField.propTypes = {
  changeEvent: PropTypes.string,
  classNameError: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FormField.defaultProps = {
  changeEvent: 'onInput',
  classNameError: 'form__input_error',
};

export default FormField;
