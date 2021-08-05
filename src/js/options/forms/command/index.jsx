import { h, Component, createRef } from 'preact';
import PropTypes from 'prop-types';
import CodeEditor from 'components/code-editor';
import ButtonLink from 'components/button-link';
import ShortcutSelect from 'components/shortcut-select';
import Conditions from 'components/conditions';
import Form from 'components/form';
import FormField from 'components/form/form-field';
import LaunchIcon from 'images/launch.svg';
import {
  LINK_CONFIGURE_COMMANDS,
  LINK_MATCH_PATTERNS_HELP,
  CONDITION_FLAG_NAMES,
} from 'constants';

class CommandForm extends Component {
  nameInputRef = createRef();

  constructor(props) {
    super(props);

    const { defaultValue } = props;
    const conditions = {
      url: defaultValue?.conditions?.url ?? '',
    };

    CONDITION_FLAG_NAMES.forEach((conditionFlagName) => {
      conditions[conditionFlagName] = defaultValue?.conditions[conditionFlagName] ?? false;
    });

    this.state = {
      name: defaultValue?.name ?? '',
      shortcutId: defaultValue?.shortcutId ?? '',
      description: defaultValue?.description ?? '',
      script: defaultValue?.script ?? '',
      conditions,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onInputConditions = this.onInputConditions.bind(this);
    this.onInputUrl = this.onInputUrl.bind(this);
    this.onChangeScript = this.onChangeScript.bind(this);
    this.goToChangeCommandPage = this.goToChangeCommandPage.bind(this);
    this.goToMatchPatternsPage = this.goToMatchPatternsPage.bind(this);
    this.onChangeShortcut = this.onChangeShortcut.bind(this);
  }

  componentDidMount() {
    this.nameInputRef?.current.focus();
  }

  onSubmit() {
    const { name, shortcutId, description, script, conditions } = this.state;
    const { onSubmit } = this.props;

    onSubmit({
      name,
      shortcutId,
      description,
      script,
      conditions,
    });
  }

  onValidate() {
    const { name, script } = this.state;
    const errors = [];

    if (name === '') {
      errors.push({
        fieldName: 'name',
        message: chrome.i18n.getMessage('pleaseFillOutField'),
      });
    }

    if (script === '') {
      errors.push({
        fieldName: 'code',
        message: chrome.i18n.getMessage('pleaseFillOutField'),
      });
    }

    return errors;
  }

  onChangeScript(script) {
    return this.setState({
      script,
    });
  }

  onInput({ target }) {
    return this.setState({
      [target.name]: target.value,
    });
  }

  onInputUrl({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState(({ conditions }) => ({
      conditions: {
        ...conditions,
        [target.name]: value,
      },
    }));
  }

  onInputConditions({ target }) {
    this.setState(({ conditions }) => ({
      conditions: {
        ...conditions,
        [target.name]: target.checked,
      },
    }));
  }

  onChangeShortcut(id) {
    this.setState({
      shortcutId: id,
    });
  }

  setState(newState) {
    return new Promise((resolve) => {
      super.setState(newState, resolve);
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
      <Form
        onSubmit={this.onSubmit}
        onValidate={this.onValidate}
      >
        <div className="form__group-fields">
          <div className="form__field form__group-field">
            <label htmlFor="name" className="form__label">
              {chrome.i18n.getMessage('name')}
            </label>
            <FormField>
              <input
                id="name"
                name="name"
                type="text"
                className="form__input"
                value={name}
                onInput={this.onInput}
                ref={this.nameInputRef}
              />
            </FormField>
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
              className="form__input"
              value={conditions.url}
              onInput={this.onInputUrl}
            />
          </div>
        </div>

        <Conditions
          value={conditions}
          onInput={this.onInputConditions}
        />

        <div className="form__field">
          <label htmlFor="code" className="form__label">
            {chrome.i18n.getMessage('code')}
          </label>
          <FormField
            changeEvent="onChange"
            classNameError="code-editor-wrapper_error"
          >
            <CodeEditor
              name="code"
              value={script}
              onChange={this.onChangeScript}
            />
          </FormField>
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
      </Form>
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
