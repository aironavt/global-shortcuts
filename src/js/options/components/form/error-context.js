import { createContext } from 'preact';

const ErrorContext = createContext({
  errors: [],
  onValidate: () => {},
});

export default ErrorContext;
