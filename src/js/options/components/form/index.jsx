import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import ErrorContext from './error-context';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onValidate = this.onValidate.bind(this);
  }

  onSubmit(event) {
    const { onSubmit, onValidate } = this.props;

    event.preventDefault();

    const newErrors = onValidate({
      fieldNames: [],
    });

    this.updateErrors(newErrors);

    if (newErrors.length === 0) {
      onSubmit(event, newErrors);
    }
  }

  onValidate({ fieldNames: changedFieldNames }) {
    const newErrors = this.props.onValidate({
      fieldNames: changedFieldNames,
    });

    this.updateErrors(newErrors, changedFieldNames);
  }

  updateErrors(newErrors, changedFieldNames = []) {
    this.setState(({ errors: prevErrors }) => {
      if (changedFieldNames.length === 0) {
        return {
          errors: newErrors,
        };
      }

      const nextErrors = [];

      changedFieldNames.forEach((changedFieldName) => {
        const errorsOfChangedFields = newErrors.filter(({ fieldName }) => fieldName === changedFieldName);

        if (errorsOfChangedFields.length > 0) {
          nextErrors.push(...errorsOfChangedFields);
        }
      });

      prevErrors.forEach((prevError) => {
        if (changedFieldNames.indexOf(prevError.fieldName) === -1) {
          nextErrors.push(prevError);
        }
      });

      return { errors: nextErrors };
    });
  }

  render(props, { errors }) {
    return (
      <form action="" className="form" onSubmit={this.onSubmit}>
        <ErrorContext.Provider
          value={{
            errors,
            onValidate: this.onValidate,
          }}
        >
          {props.children}
        </ErrorContext.Provider>
      </form>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};

export default Form;
