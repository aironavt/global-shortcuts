import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import List from 'components/list';
import { route } from 'preact-router';

class ListPage extends Component {
  constructor(props) {
    super(props);

    this.createButtonRef = null;

    this.onCreate = this.onCreate.bind(this);
    this.onEditCommand = this.onEditCommand.bind(this);
  }

  componentWillUpdate({ commands }) {
    if (commands?.length === 0) {
      this.createButtonRef.focus();
    }
  }

  onCreate() {
    route('/create');
  }

  onEditCommand(id) {
    route(`/edit/${id}`);
  }

  render() {
    const {
      commands = [],
      commandShortcuts,
      onRemoveCommand,
    } = this.props;

    const items = commands.map((command) => {
      const browserCommand = commandShortcuts.find(({ name }) => command
        .shortcutId.toString() === name.toString());

      return {
        ...command,
        shortcutValue: browserCommand?.shortcut,
      };
    });

    return (
      <div className="wrapper">
        <h1 className="title">
          {chrome.i18n.getMessage('shortcutListPageTitle')}
        </h1>
        <div className="content">
          <button
            className="toolbar-button"
            type="button"
            onClick={this.onCreate}
            ref={(ref) => this.createButtonRef = ref}
            autoFocus
          >
            <span className="toolbar-button__text">
              {chrome.i18n.getMessage('createShortcut')}
            </span>
            <span className="toolbar-button__info">
              {commands.length}
            </span>
          </button>
          <List
            items={items}
            onRemoveItem={onRemoveCommand}
            onGoToItem={this.onEditCommand}
          />
        </div>
      </div>
    );
  }
}

ListPage.propTypes = {
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
  onRemoveCommand: PropTypes.func,
};

ListPage.defaultProps = {
  commands: [],
  commandShortcuts: [],
  onRemoveCommand: null,
};

export default ListPage;
