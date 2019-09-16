import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { route } from 'preact-router';
import CommandForm from 'forms/command';

class CreatePage extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onReturnToList = this.onReturnToList.bind(this);
  }

  onSubmit(data) {
    const { onCreateCommand } = this.props;

    onCreateCommand(data);
  }

  onReturnToList() {
    route('/');
  }

  render() {
    const { commandShortcuts } = this.props;

    return (
      <div className="wrapper">
        <h1 className="title">Create a new shortcut</h1>
        <div className="content">
          <div className="shortcut-list__item-detail">
            <CommandForm
              commandShortcuts={commandShortcuts}
              onSubmit={this.onSubmit}
              onCancel={this.onReturnToList}
            />
          </div>
        </div>
      </div>
    );
  }
}

CreatePage.propTypes = {
  commandShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  onCreateCommand: PropTypes.func,
};

CreatePage.defaultProps = {
  commandShortcuts: [],
  onCreateCommand: null,
};

export default CreatePage;
