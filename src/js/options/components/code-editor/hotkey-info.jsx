import { h } from 'preact';
import { isMac } from 'options/utils';

const join = (data, separator = ', ') => data.reduce((previous, current) => [previous, separator, current]);

function HotkeyInfo({ commands }) {
  const hotkeys = commands.map(({ bindKey }) => {
    const rawHotkey = isMac() ? bindKey.mac : bindKey.win;
    const hotkey = rawHotkey.split('-').map((key) => <span className="hotkey__button">{key}</span>);

    return (
      <span className="hotkey">
        {join(hotkey, ' + ')}
      </span>
    );
  });

  return join(hotkeys, ` ${chrome.i18n.getMessage('or')} `);
}

export default HotkeyInfo;
