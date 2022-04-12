import { createElement } from "lwc";
import MultiSelectComboboxDemo from "c/multiSelectComboboxDemo";

describe("c-multi-select-combobox-demo test suite", () => {
  function flushPromises() {
    return new Promise((resolve) => setImmediate(resolve));
  }

  it("test initial value of pills, disable, zeroSelectionFlag and label", () => {
    const element = createElement("c-multi-select-combobox-demo", {
      is: MultiSelectComboboxDemo
    });
    document.body.appendChild(element);
    const options = [
      { label: "one", value: "1" },
      { label: "two", value: "2" },
      { label: "three", value: "3" },
      { label: "four", value: "4" }
    ];
    return flushPromises().then(() => {
      const cmboBox = element.shadowRoot.querySelector(
        "c-multiselect-combobox"
      );
      expect(cmboBox.disabled).toBe(false);
      expect(cmboBox.pills).toBe(true);
      expect(cmboBox.zeroSelectionAllowed).toBe(false);
      expect(cmboBox.options).toEqual(options);
    });
  });
});
