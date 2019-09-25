export default class GlobalShortcuts {
  ALLOWED_PROTOCOLS = ['http', 'https', 'ftp', 'file'];
  storage;

  constructor() {
    this.initializedStore();
  }

  async initializedStore() {
    const Storage = await import(/* webpackChunkName: "storage" */ 'utils/storage');
    this.storage = new Storage.default();

    await this.storage.fetch();
  }

  getCommandHandler() {
    return this.commandHandler.bind(this);
  }

  commandHandler(calledCommandId) {
    const { commands } = this.storage.get();

    if (commands === undefined || commands.length === 0) {
      // Commands not created or not initialized
      return;
    }

    commands.forEach(({ shortcutId, script, conditions }) => {
      if (shortcutId === calledCommandId) {
        this.runCommand({
          script,
          conditions,
        });
      }
    });
  }

  runCommand({ script: rawScript, conditions }) {
    const queryInfo = this.makeQueryInfo(conditions);
    const script = String(rawScript).trim();

    if (script === '') {
      return;
    }

    chrome.tabs.query(queryInfo, (tabs) => {
      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for (const tabIndex in tabs) {
        if (!Object.prototype.hasOwnProperty.call(tabs, tabIndex)) {
          continue;
        }

        const tab = tabs[tabIndex];

        if (!this.isProtocolChecking(tab.url)) {
          continue;
        }

        if (conditions.onlyForFirsTab && tabIndex > 0) {
          break;
        }

        chrome.tabs.executeScript(tab.id, { code: script }, () => {
          if (process.env.NODE_ENV === 'production') {
            // Hide error messages in production
            // eslint-disable-next-line no-unused-expressions
            chrome.runtime.lastError;
          }
        });
      }
    });
  }

  makeQueryInfo(conditions) {
    const {
      url = '',
    } = conditions;
    const queryInfo = {};

    if (url) {
      queryInfo.url = url;
    }

    return queryInfo;
  }

  isProtocolChecking(url) {
    try {
      const protocol = new URL(url).protocol.slice(0, -1);

      return this.ALLOWED_PROTOCOLS.indexOf(protocol) !== -1;
    } catch (error) {
      return false;
    }
  }
}
