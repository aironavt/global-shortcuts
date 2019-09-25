import { h, Component } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const DefaultOption = ({ name }) => name;

class Option extends Component {
  constructor(props) {
    super(props);

    this.itemRef = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  componentWillUpdate({ isActive = false }) {
    if (isActive && this.itemRef) {
      this.itemRef.scrollIntoViewIfNeeded();
    }
  }

  onMouseDown(event) {
    const { onSelectItem, id } = this.props;

    event.preventDefault();

    onSelectItem(id);
  }

  onMouseEnter() {
    const { setActiveItemById, id } = this.props;

    setActiveItemById(id);
  }

  render() {
    const {
      id,
      name,
      isSelect,
      isActive,
      optionProps,
      optionComponent,
    } = this.props;
    const OptionValue = optionComponent || DefaultOption;

    return (
      <div
        className={classNames('select__option', {
          select__option_active: isActive,
          select__option_select: isSelect,
        })}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        ref={(ref) => this.itemRef = ref}
        role="presentation"
      >
        <OptionValue
          id={id}
          name={name}
          isSelect={isSelect}
          isActive={isActive}
          {...optionProps}
        />
      </div>
    );
  }
}

Option.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isSelect: PropTypes.bool,
  isActive: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  optionProps: PropTypes.object,
  optionComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  onSelectItem: PropTypes.func,
  setActiveItemById: PropTypes.func,
};

Option.defaultProps = {
  isSelect: false,
  isActive: false,
  optionProps: null,
  optionComponent: null,
  onSelectItem: null,
  setActiveItemById: null,
};

export default Option;
