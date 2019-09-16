import { h, Component } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
    };

    this.AceEditor = null;

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  async componentDidMount() {
    const aceEditor = await import(/* webpackChunkName: "ace-editor" */ 'react-ace');

    this.AceEditor = aceEditor.default;

    await import(/* webpackChunkName: "brace" */ 'brace');
    await import(/* webpackChunkName: "brace-js" */ 'brace/mode/javascript');
    await import(/* webpackChunkName: "brace-other" */ 'brace/theme/chrome');
    await import(/* webpackChunkName: "brace-other" */ 'brace/ext/language_tools');
    await import(/* webpackChunkName: "brace-other" */ 'brace/snippets/javascript');

    this.forceUpdate();
  }

  onFocus() {
    this.setState({ isFocus: true });
  }

  onBlur() {
    this.setState({ isFocus: false });
  }

  render() {
    const { name, value, onChange } = this.props;
    const { isFocus } = this.state;

    return (
      <div
        className={classNames(
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
              fontSize={13}
              theme="chrome"
              name={name}
              editorProps={{ $blockScrolling: Infinity }}
              value={value}
              onChange={onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              enableLiveAutocompletion
              enableBasicAutocompletion
              enableMultiselect
              enableSnippets
              tabSize={2}
            />
          ) : null
        }
      </div>
    );
  }
}

Code.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

Code.defaultProps = {
  name: '',
  value: '',
  onChange: null,
};

export default Code;
