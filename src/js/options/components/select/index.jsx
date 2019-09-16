import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Select from './select';

class SelectWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selectItemId: props.value,
      menuIsOpen: false,
      isEdited: false,
    };

    this.setFilter = this.setFilter.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(selectItemId) {
    const { onChange } = this.props;

    this.setState({
      menuIsOpen: false,
      isEdited: false,
      inputValue: '',
      selectItemId,
    });

    onChange(selectItemId);
  }

  setFilter(inputValue) {
    this.setState({
      isEdited: true,
      inputValue,
    });
  }

  openMenu() {
    this.setState({
      menuIsOpen: true,
    });
  }

  closeMenu() {
    this.setState({
      menuIsOpen: false,
      isEdited: false,
      inputValue: '',
    });
  }

  render() {
    const {
      id,
      valueContainerComponent,
      optionComponent,
      options = [],
    } = this.props;

    const {
      inputValue,
      selectItemId,
      menuIsOpen,
      isEdited,
    } = this.state;

    const filteredOptions = inputValue ?
      options.filter((option) => option.name.indexOf(inputValue) !== -1) :
      options;

    return (
      <Select
        id={id}
        items={filteredOptions}
        inputValue={inputValue}
        selectItemId={selectItemId}
        setFilter={this.setFilter}
        openMenu={this.openMenu}
        closeMenu={this.closeMenu}
        onGoToItem={this.onSelect}
        menuIsOpen={menuIsOpen}
        isEdited={isEdited}
        valueContainerComponent={valueContainerComponent}
        optionComponent={optionComponent}
      />
    );
  }
}

SelectWrapper.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  valueContainerComponent: PropTypes.element,
  optionComponent: PropTypes.element,
  onChange: PropTypes.func,
};

SelectWrapper.defaultProps = {
  id: '',
  value: '',
  options: [],
  valueContainerComponent: null,
  optionComponent: null,
  onChange: null,
};

export default SelectWrapper;
