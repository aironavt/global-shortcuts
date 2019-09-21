/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */

import { h, Component } from 'preact';
import withKeyHandlerList from 'enhancer/key-handler-list';
import PropTypes from 'prop-types';
import ItemList from './item-list';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    const { activeItem } = this.state;
    const { items } = this.props;
    const newState = {
      isFocus: true,
    };

    if (!activeItem) {
      newState.activeItem = items[0].id;
    }

    this.setState(newState);
  }

  onBlur() {
    this.setState({ isFocus: false });
  }

  render() {
    const {
      items,
      onGoToItem,
      onRemoveItem,
      onKeyDown,
      activeItemIndex,
      setActiveItemById,
    } = this.props;
    const { isFocus } = this.state;

    return (
      items.length ? (
        <nav>
          <ul
            className="shortcut-list"
            tabIndex="0"
            onKeyDown={onKeyDown}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          >
            {
              items.map(({ id, name, description, shortcutValue }, key) => (
                <ItemList
                  id={id}
                  key={id}
                  name={name}
                  description={description}
                  shortcutValue={shortcutValue}
                  isActive={isFocus && activeItemIndex === key}
                  onEditItem={onGoToItem}
                  onMouseDown={setActiveItemById}
                  onRemoveItem={onRemoveItem}
                />
              ))
            }
          </ul>
        </nav>
      ) : (
        <div className="shortcut-list">
          <div className="shortcut-list__empty">
            {chrome.i18n.getMessage('noCommandsAddedYet')}
          </div>
        </div>
      )
    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  activeItemIndex: PropTypes.number,
  onGoToItem: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onKeyDown: PropTypes.func,
  setActiveItemById: PropTypes.func,
};

List.defaultProps = {
  activeItemIndex: 0,
  onGoToItem: null,
  onRemoveItem: null,
  onKeyDown: null,
  setActiveItemById: null,
};

export default withKeyHandlerList(List);
