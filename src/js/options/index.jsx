import { h, Component, render } from 'preact';
import Router, { route } from 'preact-router';
import { CreatePage, EditPage, ListPage } from 'pages';
import { createHashHistory } from 'history';
import { uuid, logger } from 'options/utils';
import 'styles/app.scss';

class App extends Component {
  constructor() {
    super();

    this.state = {
      // Information about all shortcuts
      commandShortcuts: [],
      // Are all required data received
      initialized: false,
      // Synchronized storage
      storage: {
        commands: [],
      },
    };

    this.onCreateCommand = this.onCreateCommand.bind(this);
    this.onRemoveCommand = this.onRemoveCommand.bind(this);
    this.onEditCommand = this.onEditCommand.bind(this);
    this.onUserComeBack = this.onUserComeBack.bind(this);
  }

  async componentDidMount() {
    const commandShortcuts = await this.getCommandShortcuts();
    const storage = await this.initStorage();

    this.setState({
      initialized: true,
      commandShortcuts,
      storage,
    });

    window.addEventListener('focus', this.onUserComeBack);
  }

  async onCreateCommand(value) {
    const { storage } = this.state;

    await this.setState({
      storage: {
        ...storage,
        commands: storage.commands.concat({
          id: uuid(),
          ...value,
        }),
      },
    });

    await this.saveToStorageAndReturnToList();
  }

  async onEditCommand(id, value) {
    const { storage } = this.state;
    const editCommand = storage.commands.findIndex((command) => command.id === id);
    const commands = [...storage.commands];

    commands[editCommand] = {
      ...value,
      id,
    };

    await this.setState({
      storage: {
        ...storage,
        commands,
      },
    });

    await this.saveToStorageAndReturnToList();
  }

  async onRemoveCommand(id) {
    await this.setState(({ storage }) => ({
      storage: {
        ...storage,
        commands: storage.commands.filter((command) => command.id !== id),
      },
    }));

    try {
      await this.saveStorage();
    } catch (error) {
      logger.error(error);
    }
  }

  async onUserComeBack() {
    // Update the value of the shortcuts
    // as the user could change them on another tab
    await this.updateCommandShortcuts();
  }

  getCommandShortcuts() {
    return new Promise((resolve) => {
      chrome.commands.getAll((commandShortcuts) => {
        resolve(this.commandShortcutsPreparation(commandShortcuts));
      });
    });
  }

  setState(newState) {
    return new Promise((resolve) => {
      super.setState(newState, resolve);
    });
  }

  componentWilUnmount() {
    window.removeEventListener('focus', this.onUserComeBack);
  }

  commandShortcutsPreparation(commandShortcuts) {
    return commandShortcuts
      .map(({ name, description, shortcut }) => ({
        id: parseInt(name, 10),
        name,
        description,
        shortcut,
      }))
      .sort(this.sortCommandShortcutsById);
  }

  sortCommandShortcutsById(a, b) {
    return a.id - b.id;
  }

  async initStorage() {
    let data;
    const initValue = {
      commands: [],
    };

    const Storage = await import(/* webpackChunkName: "storage" */ 'utils/storage');

    this.storage = new Storage.default();

    try {
      data = await this.storage.fetch();
    } catch (error) {
      logger.error(error);
    }

    return {
      ...initValue,
      ...data,
    };
  }

  async saveToStorageAndReturnToList() {
    try {
      await this.saveStorage();

      route('/');
    } catch (error) {
      logger.error(error);
    }
  }

  async saveStorage() {
    const { storage } = this.state;

    await this.storage.set(storage);
  }

  async updateCommandShortcuts() {
    const commandShortcuts = await this.getCommandShortcuts();

    this.setState({
      commandShortcuts,
    });
  }

  render() {
    const {
      initialized,
      storage,
      commandShortcuts,
    } = this.state;

    if (initialized !== true) {
      return (
        <div>Initialization</div>
      );
    }

    return (
      <Router history={createHashHistory()}>
        <CreatePage
          path="/create"
          commands={storage.commands}
          commandShortcuts={commandShortcuts}
          onCreateCommand={this.onCreateCommand}
        />
        <EditPage
          path="/edit/:id"
          commands={storage.commands}
          commandShortcuts={commandShortcuts}
          onEditCommand={this.onEditCommand}
        />
        <ListPage
          commands={storage.commands}
          commandShortcuts={commandShortcuts}
          onRemoveCommand={this.onRemoveCommand}
          default
        />
      </Router>
    );
  }
}

render(<App />, document.body);
