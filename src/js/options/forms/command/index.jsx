import { h, Component, createRef } from 'preact';
import PropTypes from 'prop-types';
import CodeEditor from 'components/code-editor';
import ButtonLink from 'components/button-link';
import Checkbox from 'components/checkbox';
import ShortcutSelect from 'components/shortcut-select';
import LaunchIcon from 'images/launch.svg';
import {
  LINK_CONFIGURE_COMMANDS,
  LINK_MATCH_PATTERNS_HELP,
} from 'constants';

class CommandForm extends Component {
  nameInputRef = createRef();

  constructor(props) {
    super(props);

    const { defaultValue } = props;

    this.state = {
      name: defaultValue?.name ?? '',
      shortcutId: defaultValue?.shortcutId ?? '',
      description: defaultValue?.description ?? '',
      script: defaultValue?.script ?? '',
      conditions: {
        url: defaultValue?.conditions?.url ?? '',
        onlyForFirsTab: defaultValue?.conditions?.onlyForFirsTab ?? false,
      },
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onInputConditions = this.onInputConditions.bind(this);
    this.onChangeScript = this.onChangeScript.bind(this);
    this.goToChangeCommandPage = this.goToChangeCommandPage.bind(this);
    this.goToMatchPatternsPage = this.goToMatchPatternsPage.bind(this);
    this.onChangeShortcut = this.onChangeShortcut.bind(this);
  }

  componentDidMount() {
    this.nameInputRef?.current.focus();
  }

  onSubmit(event) {
    const { name, shortcutId, description, script, conditions } = this.state;
    const { onSubmit } = this.props;

    event.preventDefault();

    onSubmit({
      name,
      shortcutId,
      description,
      script,
      conditions,
    });
  }

  onChangeScript(script) {
    this.setState({
      script,
    });
  }

  onInput({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  onInputConditions({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState(({ conditions }) => ({
      conditions: {
        ...conditions,
        [target.name]: value,
      },
    }));
  }

  onChangeShortcut(id) {
    this.setState({
      shortcutId: id,
    });
  }

  goToChangeCommandPage(event) {
    event.preventDefault();

    const properties = {
      url: LINK_CONFIGURE_COMMANDS,
      active: true,
    };

    chrome.tabs.create(properties);
  }

  goToMatchPatternsPage(event) {
    event.preventDefault();

    const properties = {
      url: LINK_MATCH_PATTERNS_HELP,
      active: true,
    };

    chrome.tabs.create(properties);
  }

  render() {
    const {
      onCancel,
      commandShortcuts,
    } = this.props;
    const {
      name,
      shortcutId,
      description,
      conditions,
      script,
    } = this.state;

    return (
      <form action="" className="form" onSubmit={this.onSubmit}>
        <div className="form__group-fields">
          <div className="form__field form__group-field">
            <label htmlFor="name" className="form__label">
              {chrome.i18n.getMessage('name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form_input"
              value={name}
              onInput={this.onInput}
              ref={this.nameInputRef}
            />
          </div>
          <div className="form__field form__group-field">
            <label htmlFor="shortcut" className="form__label form__label_groups">
              <span>
                {chrome.i18n.getMessage('shortcut')}
              </span>
              <ButtonLink
                icon={LaunchIcon}
                onClick={this.goToChangeCommandPage}
              >
                {chrome.i18n.getMessage('changeCommandShortcut')}
              </ButtonLink>
            </label>
            <ShortcutSelect
              id="shortcut"
              name="shortcutId"
              options={commandShortcuts}
              value={shortcutId}
              onChange={this.onChangeShortcut}
            />
          </div>
        </div>

        <div className="form__group-fields">
          <div className="form__field form__group-field">
            <label htmlFor="url" className="form__label form__label_groups">
              <span>
                {chrome.i18n.getMessage('url')}
                <span className="form__label-info">
                  {`(${chrome.i18n.getMessage('optionalField')})`}
                </span>
              </span>
              <ButtonLink
                icon={LaunchIcon}
                onClick={this.goToMatchPatternsPage}
              >
                {chrome.i18n.getMessage('matchPatternsHelp')}
              </ButtonLink>
            </label>
            <input
              id="url"
              name="url"
              type="text"
              className="form_input"
              value={conditions.url}
              onInput={this.onInputConditions}
            />
          </div>
          <div className="form__field form__group-field">
            <span className="form__label" />
            <Checkbox
              label={chrome.i18n.getMessage('onlyForFirstTabMatched')}
              name="onlyForFirsTab"
              checked={conditions.onlyForFirsTab}
              onInput={this.onInputConditions}
            />
          </div>
        </div>

        <div className="form__field">
          <label htmlFor="code" className="form__label">
            {chrome.i18n.getMessage('code')}
          </label>
          <CodeEditor
            name="code"
            value={script}
            onChange={this.onChangeScript}
          />
        </div>
        <div className="form__field">
          <label htmlFor="description" className="form__label">
            {chrome.i18n.getMessage('description')}
            <span className="form__label-info">
              {`(${chrome.i18n.getMessage('optionalField')})`}
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            className="form__textarea"
            value={description}
            onInput={this.onInput}
          />
        </div>
        <div className="form__footer">
          <button
            type="button"
            className="button"
            onClick={onCancel}
          >
            {chrome.i18n.getMessage('cancel')}
          </button>
          <button
            type="submit"
            className="button button_primary"
          >
            {chrome.i18n.getMessage('save')}
          </button>
        </div>
      </form>
    );
  }
}

CommandForm.propTypes = {
  defaultValue: PropTypes.shape({
    name: PropTypes.string,
    shortcutId: PropTypes.string,
    description: PropTypes.string,
    script: PropTypes.string,
    conditions: PropTypes.shape({
      url: PropTypes.string,
      onlyForFirsTab: PropTypes.bool,
    }),
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  commandShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

CommandForm.defaultProps = {
  defaultValue: null,
  onSubmit: null,
  onCancel: null,
  commandShortcuts: [],
};

export default CommandForm;
