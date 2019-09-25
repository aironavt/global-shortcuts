/* eslint-disable jsx-a11y/no-static-element-interactions */

import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withKeyHandlerList from 'enhancer/key-handler-list';
import DropdownIcon from 'images/dropdown.svg';
import Options from './options';
import ValueContainer from './value-container';

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this.inputRef = null;

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickControl = this.onClickControl.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }

  onInput(event) {
    const {
      menuIsOpen,
      openMenu,
      setFilter,
    } = this.props;

    event.preventDefault();

    if (!menuIsOpen) {
      openMenu();
    }

    setFilter(event.target.value);
  }

  onClick(event) {
    const {
      menuIsOpen,
      openMenu,
    } = this.props;

    event.stopPropagation();

    if (!menuIsOpen) {
      openMenu();
    }
  }

  onFocus() {
    this.setState({ isFocused: true });
  }

  onBlur() {
    const {
      menuIsOpen,
      closeMenu,
    } = this.props;

    this.setState({ isFocused: false });

    if (menuIsOpen) {
      closeMenu();
    }
  }

  onClickControl(event) {
    const {
      menuIsOpen,
      openMenu,
      closeMenu,
    } = this.props;

    event.preventDefault();

    if (!menuIsOpen) {
      openMenu();
    } else {
      closeMenu();
    }

    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  onSelectItem(id) {
    const { onGoToItem } = this.props;

    onGoToItem(id);
  }

  onKeyDown(event) {
    const {
      menuIsOpen,
      closeMenu,
      openMenu,
      onKeyDown,
    } = this.props;

    if (!menuIsOpen &&
      (event.code === 'ArrowDown' || event.code === 'ArrowUp' || event.code === 'Enter')
    ) {
      openMenu();

      return;
    }

    if (menuIsOpen && event.code === 'Escape') {
      closeMenu();

      return;
    }

    onKeyDown(event);
  }

  getCurrentValue() {
    const {
      items = [],
      selectItemId,
    } = this.props;

    return items.find(({ id }) => id.toString() === selectItemId.toString());
  }

  render() {
    const {
      id,
      menuIsOpen,
      selectItemId,
      items = [],
      placeholder,
      activeItemIndex,
      setActiveItemById,
      isEdited,
      inputValue,
      valueContainerComponent,
      optionComponent,
    } = this.props;
    const {
      isFocused,
    } = this.state;
    const currentValue = this.getCurrentValue();
    const ValueContainerComponent = valueContainerComponent || ValueContainer;

    return (
      <div
        className="select"
        onKeyDown={this.onKeyDown}
      >
        <div
          className={classNames('select__control', { 'select__control_is-focused': isFocused })}
          onMouseDown={this.onClickControl}
        >
          <div className="select__value">
            {
              currentValue ? (
                <ValueContainerComponent
                  {...currentValue}
                />
              ) : (
                <div className="select__placeholder">
                  {placeholder}
                </div>
              )
            }
            <input
              id={id}
              type="text"
              className={classNames('select__input', { 'select__input_is-edited': isEdited })}
              onInput={this.onInput}
              onMouseDown={this.onClick}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              ref={(ref) => this.inputRef = ref}
              value={inputValue}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-autocomplete="list"
            />
          </div>
          <div className="select__dropdown">
            <div
              className={classNames(
                'select__dropdown-icon ',
                { 'select__dropdown-icon_open': menuIsOpen },
              )}
            >
              <DropdownIcon
                width="28"
                height="28"
              />
            </div>
          </div>
        </div>
        <div className="select__menu-wrapper">
          {
            menuIsOpen ? (
              <div className="select__menu">
                <Options
                  items={items}
                  activeItemIndex={activeItemIndex}
                  selectItemId={selectItemId}
                  onSelectItem={this.onSelectItem}
                  setActiveItemById={setActiveItemById}
                  optionComponent={optionComponent}
                />
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  placeholder: PropTypes.string,
  menuIsOpen: PropTypes.bool,
  isEdited: PropTypes.bool,
  valueContainerComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  optionComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  inputValue: PropTypes.string,
  selectItemId: PropTypes.string,
  activeItemIndex: PropTypes.number,
  onGoToItem: PropTypes.func,
  setFilter: PropTypes.func,
  setActiveItemById: PropTypes.func,
  closeMenu: PropTypes.func,
  openMenu: PropTypes.func,
  onKeyDown: PropTypes.func,
};

Select.defaultProps = {
  id: '',
  items: [],
  placeholder: 'Select...',
  menuIsOpen: false,
  isEdited: false,
  valueContainerComponent: null,
  optionComponent: null,
  inputValue: '',
  selectItemId: '',
  activeItemIndex: null,
  onGoToItem: null,
  setFilter: null,
  setActiveItemById: null,
  closeMenu: null,
  openMenu: null,
  onKeyDown: null,
};

export default withKeyHandlerList(Select, { canRemove: false });
