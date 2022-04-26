import { LightningElement, track } from "lwc";

export default class MultiSelectComboboxDemo extends LightningElement {
  @track selectedOptions = [];
  @track cbOptions = [
    { label: "one", value: "1" },
    { label: "two", value: "2" },
    { label: "three", value: "3" },
    { label: "four", value: "4" }
  ];
  @track initialSelections = [
    { label: "one", value: "1" },
    { label: "two", value: "2" },
    { label: "three", value: "3" }
  ];
  @track pills = true;
  @track disabled = false;
  @track zeroSelectionFlag = true;

  handleValueChange(event) {
    this.selectedOptions = event.detail;
    console.log(JSON.stringify(event.detail));
  }

  clickHandler() {
    this.selectedOptions = ["1", "4"];
  }
}
