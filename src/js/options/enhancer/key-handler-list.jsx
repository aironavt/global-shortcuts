import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { getDisplayName } from 'options/utils';

/**
 * Adds list navigation using the keyboard
 * @param WrappedComponent
 * @param options
 * @returns {WithKeyHandlerList}
 */
export default function withKeyHandlerList(WrappedComponent, options = {}) {
  class WithKeyHandlerList extends Component {
    constructor(props) {
      super(props);

      this.state = {
        activeItemIndex: 0,
      };

      this.onKeyDown = this.onKeyDown.bind(this);
      this.setActiveItemById = this.setActiveItemById.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      const { activeItemIndex } = this.state;
      const indexOfFirstItem = this.getIndexOfFirstItem();

      if (
        // If not activeItemIndex has changed
        prevState.activeItemIndex === activeItemIndex &&
        // Infinite loop protection
        prevState.activeItemIndex !== indexOfFirstItem
      ) {
        this.setActiveItemByIndex(indexOfFirstItem);
      }
    }

    async onKeyDown(event) {
      const { items, onGoToItem, onRemoveItem } = this.props;
      let { activeItemIndex } = this.state;
      let activeItemId;

      if (items[activeItemIndex] && items[activeItemIndex].id) {
        activeItemId = items[activeItemIndex].id;
      }

      if (!this.isHandledCode(event.code)) {
        return;
      }

      event.preventDefault();

      switch (event.code) {
        case 'ArrowDown': {
          activeItemIndex = this.nextItem(activeItemIndex);

          break;
        }

        case 'ArrowUp': {
          activeItemIndex = this.previousItem(activeItemIndex);

          break;
        }

        case 'Home': {
          activeItemIndex = this.getIndexOfFirstItem();

          break;
        }

        case 'End': {
          activeItemIndex = this.getIndexOfLastItem();

          break;
        }

        case 'Enter':
        case 'Space': {
          if (typeof onGoToItem === 'function' && activeItemId !== undefined) {
            onGoToItem(activeItemId);
          }

          break;
        }

        case 'Delete':
        case 'Backspace': {
          if (typeof onRemoveItem === 'function' && activeItemId !== undefined) {
            await onRemoveItem(activeItemId);
          }

          break;
        }

        // no default
      }

      this.setActiveItemByIndex(activeItemIndex);
    }

    setActiveItemByIndex(index) {
      const { activeItemIndex } = this.state;

      if (activeItemIndex !== index) {
        this.setState({
          activeItemIndex: index,
        });
      }
    }

    setActiveItemById(id) {
      const { items } = this.props;

      const itemIndex = items.findIndex((item) => item.id === id);

      this.setActiveItemByIndex(itemIndex);
    }

    getHandledCodes() {
      if (Array.isArray(this.handledCodes)) {
        return this.handledCodes;
      }

      const { canMove, canGo, canRemove } = this.getOptions();

      this.handledCodes = [];

      if (canMove) {
        this.handledCodes.push('ArrowUp', 'ArrowDown', 'Home', 'End');
      }

      if (canGo) {
        this.handledCodes.push('Enter', 'Space');
      }

      if (canRemove) {
        this.handledCodes.push('Delete', 'Backspace');
      }

      return this.handledCodes;
    }

    getOptions() {
      const {
        canMove = true,
        canGo = true,
        canRemove = true,
      } = options;

      return {
        canMove,
        canGo,
        canRemove,
      };
    }

    getItemCount() {
      const { items } = this.props;

      return items.length;
    }

    getIndexOfFirstItem() {
      return 0;
    }

    getIndexOfLastItem() {
      return this.getItemCount() - 1;
    }

    nextItem(index) {
      return this.checkOutOfList(index + 1);
    }

    previousItem(index) {
      return this.checkOutOfList(index - 1);
    }

    checkOutOfList(index) {
      const itemCount = this.getItemCount();
      const indexOfFirstItem = this.getIndexOfFirstItem();

      if (index >= itemCount) {
        return indexOfFirstItem;
      }

      if (index < indexOfFirstItem) {
        return this.getIndexOfLastItem();
      }

      return index;
    }

    isHandledCode(code) {
      return this.getHandledCodes().some((handledCode) => handledCode === code);
    }

    render(props, { activeItemIndex }) {
      return (
        <WrappedComponent
          activeItemIndex={activeItemIndex}
          setActiveItemById={this.setActiveItemById}
          onKeyDown={this.onKeyDown}
          {...props}
        />
      );
    }
  }

  WithKeyHandlerList.displayName = `WithKeyHandlerList(${getDisplayName(WrappedComponent)})`;

  WithKeyHandlerList.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ).isRequired,
    onGoToItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
  };

  WithKeyHandlerList.defaultProps = {
    onGoToItem: null,
    onRemoveItem: null,
  };

  return WithKeyHandlerList;
}
