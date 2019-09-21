import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Option from './option';

class Options extends Component {
  isSelected(id) {
    const { selectItemId } = this.props;

    return id.toString() === selectItemId.toString();
  }

  render() {
    const {
      items = [],
      activeItemIndex,
      onSelectItem,
      setActiveItemById,
      optionComponent,
    } = this.props;

    return (
      items.length ? (
        <nav>
          <ul className="select__options">
            {
              items.map(({ id, name, ...props }, key) => (
                <Option
                  id={id}
                  key={id}
                  isSelect={this.isSelected(id)}
                  isActive={activeItemIndex === key}
                  name={name}
                  onSelectItem={onSelectItem}
                  setActiveItemById={setActiveItemById}
                  optionComponent={optionComponent}
                  optionProps={props}
                />
              ))
            }
          </ul>
        </nav>
      ) : (
        <div className="select__options">
          <div className="select__empty-options">
            {chrome.i18n.getMessage('noOptions')}
          </div>
        </div>
      )
    );
  }
}

Options.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  activeItemIndex: PropTypes.number,
  selectItemId: PropTypes.string,
  optionComponent: PropTypes.element,
  onSelectItem: PropTypes.func,
  setActiveItemById: PropTypes.func,
};

Options.defaultProps = {
  items: [],
  activeItemIndex: null,
  selectItemId: '',
  optionComponent: null,
  onSelectItem: null,
  setActiveItemById: null,
};

export default Options;
