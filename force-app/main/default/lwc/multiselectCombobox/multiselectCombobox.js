import { LightningElement, api, track } from "lwc";

export default class MultiselectCombobox extends LightningElement {
  @api label = "";

  @track selectedOptions = []; // list of all the selected options
  @track inputValue = ""; // label that is shown in the input of the combobox
  @track inputOptions = []; // List of all the options
  @track initialSelection; // List of all the values selected initially
  @track currentValues = [];

  // Flags
  @track isComponentRendered;
  @track optionsChanged = true;
  @track dropDownInFocus = false;

  // flags that are passed from parents.
  @track _disabled = false; // Flag to know if the combobox should be disabled or not
  @track _pills = false; // Flag to know if the pills should be visible or not
  @track _isNoSelectionAllowed = false; // Flag to know if zero selection should be allowed in the combobox or not
  @track _pillIcon = false; // Pill's Icon
  @track _value;

  @api
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this.handleDisabled();
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
  get initialSelections() {
    return this.initialSelection;
  }
  set initialSelections(value) {
    let initials = [];
    this.initialSelection = this.checkOptions(initials.concat(value));
    this.optionsChanged = true;
  }

  @api
  get value() {
    return this.selectedOptions;
  }
  set value(newValue) {
    if (
      JSON.stringify(this.currentValues) !== JSON.stringify(newValue) &&
      this.checkZeroSelectionCondition(newValue)
    ) {
      this.updateSelectedOptions(newValue);
    }
  }

  @api
  get pillIcon() {
    return this._pillIcon;
  }
  set pillIcon(value) {
    this._pillIcon = value;
  }

  checkZeroSelectionCondition(value) {
    return value && (this.zeroSelectionAllowed || value.length);
  }

  updateSelectedOptions(newValue) {
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
    this.setInputValue();
    this.sendValues(this.selectedOptions);
  }

  checkOptions(options) {
    if (typeof options === "object") {
      try {
        for (let opt of options) {
          // eslint-disable-next-line no-prototype-builtins
          if (opt.hasOwnProperty("label") && opt.hasOwnProperty("value")) {
            continue;
          } else {
            return [];
          }
        }
        return options;
      } catch (err) {
        return [];
      }
    }
    return [];
  }

  renderedCallback() {
    if (!this.isComponentRendered) {
      this.handleDisabled();
      this.hasRendered = true;
    }
    if (this.optionsChanged) {
      this.setInitialValue();
      this.optionsChanged = false;
    }
  }

  setInitialValue() {
    if (this.options && this.options.length) {
      if (
        !this.disabled &&
        this.checkZeroSelectionCondition(this.initialSelections)
      ) {
        this.handleInitialSelections(this.initialSelections);
      } else {
        this.inputValue = this.options[0].label;
        this.selectedOptions = [this.options[0]];
        let firstOption = this.template.querySelectorAll(
          "li.slds-listbox__item"
        )[0];
        firstOption.firstChild.classList.add("slds-is-selected");
      }
      this.sendValues(this.selectedOptions);
    } else {
      this.inputValue = "Select an Option";
    }
  }

  removeAllInitialSelections() {
    this.template.querySelectorAll(".slds-is-selected").forEach((selecteds) => {
      selecteds.classList.remove("slds-is-selected");
    });
  }

  handleInitialSelections(initials) {
    this.selectedOptions = [];
    this.removeAllInitialSelections();
    for (let initial of initials) {
      try {
        this.template
          .querySelector(`[data-name="${initial.value}"]`)
          .classList.add("slds-is-selected");
        this.selectedOptions.push(initial);
      } catch (err) {
        continue;
      }
    }
    this.setInputValue();
  }

  handleDisabled() {
    let input = this.template.querySelector("input");
    if (input) {
      input.disabled = this.disabled;
    }
  }

  handleClick() {
    let sldsCombobox = this.template.querySelector(".slds-combobox");
    sldsCombobox.classList.toggle("slds-is-open");
  }

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
    this.currentValues = values;
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: values
      })
    );
  }

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

  setInputValue() {
    if (this.selectedOptions.length > 1) {
      this.inputValue = this.selectedOptions.length + " options selected";
    } else if (this.selectedOptions.length === 1) {
      this.inputValue = this.selectedOptions[0].label;
    } else {
      this.inputValue = "Select an Option";
    }
  }

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

  closeDropbox() {
    let sldsCombobox = this.template.querySelector(".slds-combobox");
    sldsCombobox.classList.remove("slds-is-open");
  }

  // Pill Actions  ==> If you want to remove the pills, remove these methods

  removePill(event) {
    let deletedValue = event.detail.name;
    if (!(this.selectedOptions.length === 1) || this.zeroSelectionAllowed) {
      this.unselectTheOption(deletedValue);
    }
  }

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
