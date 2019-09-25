/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import { h, Component } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TrashIcon from 'images/trash.svg';

class ItemList extends Component {
  constructor(props) {
    super(props);

    this.itemRef = null;

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
  }

  componentWillUpdate({ isActive = false }) {
    if (isActive && this.itemRef) {
      // Scroll to the active item
      this.itemRef.scrollIntoViewIfNeeded();
    }
  }

  onClick() {
    const { onEditItem, id } = this.props;

    onEditItem(id);
  }

  onMouseDown() {
    const { onMouseDown, id } = this.props;

    onMouseDown(id);
  }

  onRemoveItem(event) {
    const { onRemoveItem, id } = this.props;

    event.preventDefault();
    event.stopPropagation();

    onRemoveItem(id);
  }

  render() {
    const {
      name,
      shortcutValue,
      description,
      isActive = false,
    } = this.props;

    return (
      <li
        className={classNames('shortcut-list__item', { 'shortcut-list__item_active': isActive })}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        ref={(ref) => this.itemRef = ref}
      >
        {
          description ? (
            <div className="shortcut-list__item-name">
              <div>
                {name}
              </div>
              <div className="shortcut-list__item-note">{description}</div>
            </div>
          ) : <div className="shortcut-list__item-name">{name}</div>
        }
        <div className="shortcut-list__item-keys">{shortcutValue}</div>
        <div className="shortcut-list__item-remove">
          <button
            className="button-icon"
            type="button"
            tabIndex="-1"
            onClick={this.onRemoveItem}
            title={chrome.i18n.getMessage('hintWhenDeletingCommand', name)}
          >
            <TrashIcon
              width={24}
              height={24}
            />
          </button>
        </div>
      </li>
    );
  }
}

ItemList.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  shortcutValue: PropTypes.string,
  description: PropTypes.string,
  onEditItem: PropTypes.func,
  onMouseDown: PropTypes.func,
  onRemoveItem: PropTypes.func,
};

ItemList.defaultProps = {
  isActive: false,
  shortcutValue: '',
  description: '',
  onEditItem: null,
  onMouseDown: null,
  onRemoveItem: null,
};

export default ItemList;
