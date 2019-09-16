import { h } from 'preact';
import Select from 'components/select';
import ValueContainer from './value-container';

const ShortcutSelect = ({ ...props }) => (
  <Select
    valueContainerComponent={ValueContainer}
    optionComponent={ValueContainer}
    {...props}
  />
);

export default ShortcutSelect;
