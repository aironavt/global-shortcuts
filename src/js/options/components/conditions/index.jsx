import { h } from 'preact';
import PropTypes from 'prop-types';
import Checkbox from 'components/checkbox';
import ExpansionPanel from 'components/expansion-panel';
import { CONDITION_FLAG_NAMES } from 'constants';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Conditions({ value, onInput }) {
  const selectedConditionNames = Object.keys(value).filter((name) => value[name] === true);
  const isSelectedCondition = selectedConditionNames.length > 0;

  return (
    <div className="form__field">
      <ExpansionPanel
        isExpanded={isSelectedCondition}
        showButtonText={chrome.i18n.getMessage('showAdvancedOptions')}
        hideButtonText={chrome.i18n.getMessage('hideAdvancedOptions')}
      >
        <div className="cards">
          {CONDITION_FLAG_NAMES.map((name) => {
            const capitalizeName = capitalize(name);
            const label = chrome.i18n.getMessage(`condition${capitalizeName}Label`);

            return (
              <div className="cards__item cards__item_col_2" key={name}>
                <Checkbox
                  name={name}
                  label={label}
                  checked={selectedConditionNames.indexOf(name) !== -1}
                  onInput={onInput}
                />
              </div>
            );
          })}
        </div>
      </ExpansionPanel>
    </div>
  );
}

Conditions.propTypes = {
  value: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
  ).isRequired,
  onInput: PropTypes.func.isRequired,
};

export default Conditions;
