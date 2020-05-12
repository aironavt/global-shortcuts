import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ButtonLink from 'components/button-link';
import LaunchIcon from 'images/dropdown.svg';

class ExpansionPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: props.isExpanded,
    };

    this.onToggleDetails = this.onToggleDetails.bind(this);
  }

  onToggleDetails() {
    const { isExpanded } = this.state;

    this.setState({
      isExpanded: !isExpanded,
    });
  }

  render() {
    const { showButtonText, hideButtonText, children } = this.props;
    const { isExpanded } = this.state;
    const detailsEnteredClass = isExpanded ? 'expansion-panel__details_entered' : 'expansion-panel__details_hidden';
    const buttonText = isExpanded && hideButtonText?.length > 0 ? hideButtonText : showButtonText;

    return (
      <div className="expansion-panel">
        <div className="expansion-panel__summary">
          <ButtonLink
            icon={LaunchIcon}
            iconSize={{ width: 28, height: 28 }}
            iconClassName={{ 'button-link__icon_flip_horizontally': isExpanded }}
            alignContent="center"
            type="context"
            onClick={this.onToggleDetails}
          >
            {buttonText}
          </ButtonLink>
        </div>
        <div className={classNames('expansion-panel__details', detailsEnteredClass)}>
          {children}
        </div>
      </div>
    );
  }
}

ExpansionPanel.propTypes = {
  isExpanded: PropTypes.bool,
  showButtonText: PropTypes.string.isRequired,
  hideButtonText: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ExpansionPanel.defaultProps = {
  isExpanded: false,
  hideButtonText: '',
};

export default ExpansionPanel;
