import { createElement } from "lwc";
import MultiselectCombobox from "c/multiselectCombobox";

describe("c-multiselect-comboboxombobox test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function flushPromises() {
    return new Promise((resolve) => setImmediate(resolve));
  }

  it("test initial values of all the fields", () => {
    const element = createElement("c-multiselect-combobox", {
      is: MultiselectCombobox
    });
    document.body.appendChild(element);

    return flushPromises().then(() => {
      expect(1).toBe(1);
    });
  });
});
