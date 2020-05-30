import { h } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function ButtonLink({
  icon: Icon,
  iconSize,
  iconClassName,
  alignContent,
  type,
  children,
  ...props
}) {
  const typeClass = type === 'context' ? 'button-link__text_context' : 'button-link__text_external';
  const { width, height } = iconSize;

  return (
    <button
      className={classNames('button-link', `button-link_align-items_${alignContent}`)}
      type="button"
      {...props}
    >
      <span className={classNames('button-link__text', typeClass)}>
        {children}
      </span>
      {
        Icon ? (
          <Icon
            className={classNames('button-link__icon', iconClassName)}
            width={width}
            height={height}
          />
        ) : null
      }
    </button>
  );
}

ButtonLink.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  iconSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  iconClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.string,
    ),
    PropTypes.objectOf(
      PropTypes.bool,
    ),
  ]),
  alignContent: PropTypes.oneOf([
    'start',
    'center',
    'end',
  ]),
  type: PropTypes.oneOf([
    'context',
    'external',
  ]),
  children: PropTypes.node.isRequired,
};

ButtonLink.defaultProps = {
  icon: null,
  iconSize: {
    width: 18,
    height: 18,
  },
  iconClassName: '',
  alignContent: 'end',
  type: 'external',
};

export default ButtonLink;
