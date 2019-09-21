import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { route } from 'preact-router';
import CommandForm from 'forms/command';

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onReturnToList = this.onReturnToList.bind(this);
  }

  onSubmit(data) {
    const {
      id,
      onEditCommand,
    } = this.props;

    onEditCommand(id, data);
  }

  onReturnToList() {
    route('/');
  }

  render() {
    const {
      id,
      commands,
      commandShortcuts,
    } = this.props;
    const editCommand = commands.find((command) => command.id === id);

    return (
      <div className="wrapper">
        <h1 className="title">
          {chrome.i18n.getMessage('editPageTitle')}
        </h1>
        <div className="content">
          <div className="shortcut-list__item-detail">
            <CommandForm
              defaultValue={editCommand}
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

EditPage.propTypes = {
  id: PropTypes.string.isRequired,
  commands: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      shortcutId: PropTypes.string,
      description: PropTypes.string,
      script: PropTypes.string,
      conditions: PropTypes.shape({
        url: PropTypes.string,
        onlyForFirsTab: PropTypes.bool,
      }),
    }),
  ),
  commandShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  onEditCommand: PropTypes.func.isRequired,
};

EditPage.defaultProps = {
  commands: [],
  commandShortcuts: [],
};

export default EditPage;
