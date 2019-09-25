import { h } from 'preact';
import PropTypes from 'prop-types';

function ButtonLink({ icon: Icon, children, ...props }) {
  return (
    <button
      className="button-link"
      type="button"
      {...props}
    >
      <span className="button-link__text">
        {children}
      </span>
      {
        Icon ? (
          <Icon
            className="button-link__icon"
            width={18}
            height={18}
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
  children: PropTypes.node.isRequired,
};

ButtonLink.defaultProps = {
  icon: null,
};

export default ButtonLink;
