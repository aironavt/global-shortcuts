import { h, Component } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HotkeyInfo from './hotkey-info';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
    };

    this.AceEditor = null;

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onPreviousFormControl = this.onPreviousFormControl.bind(this);
    this.onNextFormControl = this.onNextFormControl.bind(this);
  }

  async componentDidMount() {
    const aceEditor = await import(/* webpackChunkName: "ace-editor" */ 'react-ace');

    this.AceEditor = aceEditor.default;

    await import(/* webpackChunkName: "ace-builds-js" */ 'ace-builds/src-min-noconflict/mode-javascript');
    await import(/* webpackChunkName: "ace-builds-other" */ 'ace-builds/src-min-noconflict/theme-chrome');
    await import(/* webpackChunkName: "ace-builds-other" */ 'ace-builds/src-min-noconflict/ext-language_tools');
    await import(/* webpackChunkName: "ace-builds-other" */ 'ace-builds/src-min-noconflict/snippets/javascript');

    this.forceUpdate();
  }

  onFocus() {
    this.setState({ isFocus: true });
  }

  onBlur() {
    this.setState({ isFocus: false });
  }

  onPreviousFormControl() {
    const { index, focusableFormElements } = this.getFocusElements();

    if (index > -1) {
      const nextElement = focusableFormElements[index - 1] || focusableFormElements[focusableFormElements.length - 1];

      nextElement.focus();
    }
  }

  onNextFormControl() {
    const { index, focusableFormElements } = this.getFocusElements();

    if (index > -1) {
      const nextElement = focusableFormElements[index + 1] || focusableFormElements[0];

      nextElement.focus();
    }
  }

  getFocusElements() {
    const { activeElement } = document;
    const form = activeElement?.form;
    let focusableFormElements = [];
    let index = -1;

    if (form) {
      // There are many more focusable elements
      // https://allyjs.io/data-tables/focusable.html
      const focusableElements = `[href]:not([disabled]), select:not([disabled]), button:not([disabled]),
        input:not([disabled]),[tabindex]:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])`;

      focusableFormElements = Array.prototype.filter.call(
        form.querySelectorAll(focusableElements),
        // Check for visibility while always include the current activeElement
        (element) => (element.offsetWidth > 0 || element.offsetHeight > 0 || element === activeElement),
      );
      index = focusableFormElements.indexOf(activeElement);
    }

    return {
      index,
      focusableFormElements,
    };
  }

  getCommands() {
    return [
      {
        name: 'previousFormControl',
        bindKey: { win: 'Ctrl-,', mac: 'Command-,' },
        exec: this.onPreviousFormControl,
      },
      {
        name: 'nextFormControl',
        bindKey: { win: 'Ctrl-.', mac: 'Command-.' },
        exec: this.onNextFormControl,
      },
    ];
  }

  render() {
    const { name, value, className, onChange } = this.props;
    const { isFocus } = this.state;

    return (
      <div
        className={classNames(
          className,
          'code-editor-wrapper',
          { 'code-editor-wrapper_focus': isFocus },
        )}
      >
        {
          this.AceEditor ? (
            <this.AceEditor
              className="code-editor"
              style={{ lineHeight: '1.4em' }}
              width="100%"
              mode="javascript"
              fontSize={14}
              theme="chrome"
              name={name}
              editorProps={{ $blockScrolling: Infinity }}
              setOptions={{ useWorker: false }}
              value={value}
              onChange={onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              enableLiveAutocompletion
              enableBasicAutocompletion
              enableMultiselect
              enableSnippets
              tabSize={2}
              commands={this.getCommands()}
            />
          ) : null
        }
        {
          isFocus ? (
            <div className="code-editor-footer">
              {chrome.i18n.getMessage('codeEditorNavigationInfo')}
              {' '}
              <HotkeyInfo commands={this.getCommands()} />
            </div>
          ) : null
        }
      </div>
    );
  }
}

Code.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

Code.defaultProps = {
  name: '',
  value: '',
  className: '',
  onChange: null,
};

export default Code;
