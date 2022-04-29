import { LightningElement, api, track } from "lwc";

export default class MultiselectCombobox extends LightningElement {
  @api label = "";

  @track selectedOptions = []; // list of all the selected options
  @track inputValue = ""; // place holder for the input of the combobox
  @track inputOptions = []; // List of all the options
  @track selectedValues = []; // List of all the selected values

  // Flags
  @track optionsChanged = true;
  @track dropDownInFocus = false;

  // Encapsulated propereties whose values are passed from the parent component
  @track _disabled = false; // Flag to know if the combobox should be disabled or not
  @track _pills = false; // Flag to know if the pills should be visible or not
  @track _isNoSelectionAllowed = false; // Flag to know if zero selection should be allowed in the combobox or not
  @track _pillIcon = false; // Pill's Icon

  // Getters and setters for the encapsulated properties
  @api
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }

  @api
  get pills() {
    return !this.disabled && this._pills;
  }
  set pills(value) {
    this._pills = value;
  }

  @api
  get zeroSelectionAllowed() {
    return this._isNoSelectionAllowed;
  }
  set zeroSelectionAllowed(value) {
    this._isNoSelectionAllowed = value;
  }

  @api
  get options() {
    return this.inputOptions;
  }
  set options(value) {
    let options = [];
    this.inputOptions = this.checkOptions(options.concat(value));
    this.optionsChanged = true;
  }

  @api
  get value() {
    return this.selectedValues;
  }
  set value(newValues) {
    if (
      JSON.stringify(this.selectedValues) !== JSON.stringify(newValues) &&
      this.checkZeroSelectionCondition(newValues)
    ) {
      this.selectedValues = newValues;
      this.optionsChanged = true;
    }
  }

  @api
  get pillIcon() {
    return this._pillIcon;
  }
  set pillIcon(value) {
    this._pillIcon = value;
  }

  // Checks for the condition when we get an empty list as value but the zero selection is off
  checkZeroSelectionCondition(value) {
    return value && (this.zeroSelectionAllowed || value.length);
  }

  // This method is to check the format of the options
  checkOptions(options) {
    for (let opt of options) {
      // eslint-disable-next-line no-prototype-builtins
      if (!(opt.hasOwnProperty("label") && opt.hasOwnProperty("value"))) {
        return [];
      }
    }
    return options;
  }

  // This method updates the option selection depending on the values
  updateSelectedOptions(newValue) {
    if (this.options && this.options.length) {
      // newValue = newValue.length ? newValue : this.options[0].value;
      this.selectedOptions = [];
      for (let opt of this.options) {
        let option = this.template.querySelector(`[data-name="${opt.value}"]`);
        if (newValue.includes(opt.value)) {
          option.classList.add("slds-is-selected");
          this.selectedOptions.push(opt);
        } else if (option.classList.contains("slds-is-selected")) {
          option.classList.remove("slds-is-selected");
        }
      }
      this.sendValues(this.selectedOptions);
    } else {
      this.selectedOptions = [];
    }
    this.setInputValue();
  }

  // Renders whenever the option is changed or the value is changed
  renderedCallback() {
    if (this.optionsChanged) {
      this.updateSelectedOptions(this.selectedValues);
      this.optionsChanged = false;
    }
  }

  handleClick() {
    let sldsCombobox = this.template.querySelector(".slds-combobox");
    sldsCombobox.classList.toggle("slds-is-open");
  }

  // Handles the selection event
  handleSelection(event) {
    let value = event.currentTarget.dataset.value;
    let selectedListBoxOptions =
      this.template.querySelectorAll(".slds-is-selected");
    if (
      !(
        selectedListBoxOptions.length === 1 &&
        selectedListBoxOptions[0].dataset.name === value
      ) ||
      this.zeroSelectionAllowed
    ) {
      this.handleOption(event, value);
    }
    let input = this.template.querySelector("input");
    input.focus();
  }

  // Dispatch event to send value to the parent on every change event
  sendValues(selectedOptions) {
    let values = [];
    for (const valueObject of selectedOptions) {
      values.push(valueObject.value);
    }
    this.selectedValues = values;
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: values
      })
    );
  }

  // This method handles the selection or unselection of the options
  handleOption(event, value) {
    let listBoxOption = event.currentTarget.firstChild;
    if (listBoxOption.classList.contains("slds-is-selected")) {
      this.selectedOptions = this.selectedOptions.filter(
        (option) => option.value !== value
      );
    } else {
      let option = this.options.find((opt) => opt.value === value);
      this.selectedOptions.push(option);
    }
    this.setInputValue();
    listBoxOption.classList.toggle("slds-is-selected");
    this.sendValues(this.selectedOptions);
  }

  // Handles the setting up the place holder for the combobox input
  setInputValue() {
    if (this.selectedOptions.length > 1) {
      this.inputValue = this.selectedOptions.length + " options selected";
    } else if (this.selectedOptions.length === 1) {
      this.inputValue = this.selectedOptions[0].label;
    } else {
      this.inputValue = "Select an Option";
    }
  }

  // It closes the list on blur event
  handleBlur() {
    if (!this.dropDownInFocus) {
      this.closeDropbox();
    }
  }

  handleMouseleave() {
    this.dropDownInFocus = false;
  }

  handleMouseEnter() {
    this.dropDownInFocus = true;
  }

  // This is to close the dropdown( we basically close it on onblur event)
  closeDropbox() {
    let sldsCombobox = this.template.querySelector(".slds-combobox");
    sldsCombobox.classList.remove("slds-is-open");
  }

  // Methods to control pills
  // This method handles the removal of the pill
  removePill(event) {
    let deletedValue = event.detail.name;
    if (!(this.selectedOptions.length === 1) || this.zeroSelectionAllowed) {
      this.unselectTheOption(deletedValue);
    }
  }

  // This is to unselect an option when the pills of that option is removed
  unselectTheOption(deletedValue) {
    this.selectedOptions = this.selectedOptions.filter(
      (option) => option.value !== deletedValue
    );
    this.setInputValue();
    this.template
      .querySelector(`[data-name="${deletedValue}"]`)
      .classList.remove("slds-is-selected");
    this.sendValues(this.selectedOptions);
  }
}
