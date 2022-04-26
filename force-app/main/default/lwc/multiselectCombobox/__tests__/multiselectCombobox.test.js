import { createElement } from "lwc";
import MultiselectCombobox from "c/multiselectCombobox";

describe("c-multiselect-comboboxombobox test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function flushPromises() {
    return new Promise((resolve) => setImmediate(resolve));
  }

  it("test initial values of all the fields and selections and deselections of new values", () => {
    const element = createElement("c-multiselect-combobox", {
      is: MultiselectCombobox
    });
    document.body.appendChild(element);
    return flushPromises().then(() => {
      let opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
      let input = element.shadowRoot.querySelector("input");
      const pill = element.shadowRoot.querySelector("lightning-pill");
      expect(opt.length).toBe(0);
      expect(input.disabled).toBe(false);
      expect(input.value).toBe("Select an Option");
      expect(pill).toBeNull();
      element.pills = true;
      element.options = [
        { label: "one", value: "1" },
        { label: "two", value: "2" },
        { label: "three", value: "3" },
        { label: "four", value: "4" }
      ];
      return flushPromises().then(() => {
        let pills = element.shadowRoot.querySelectorAll("lightning-pill");
        let pillIcon = element.shadowRoot.querySelector(
          "lightning-pill lightning-icon"
        );
        opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
        let combobox = element.shadowRoot.querySelector(".slds-combobox");
        let selectedOpt =
          element.shadowRoot.querySelectorAll(".slds-is-selected");
        expect(pills.length).toBe(1);
        expect(pills[0].label).toBe("one");
        expect(pillIcon).toBeNull();
        expect(input.value).toBe("one");
        expect(opt.length).toBe(4);
        expect(combobox.classList).not.toContain("slds-is-open");
        expect(selectedOpt.length).toBe(1);
        input.click();
        expect(combobox.classList).toContain("slds-is-open");
        opt[1].click();
        opt[2].click();
        element.pillIcon = "standard:user";
        return flushPromises()
          .then(() => {
            pillIcon = element.shadowRoot.querySelectorAll(
              "lightning-pill lightning-icon"
            );
            input = element.shadowRoot.querySelector("input");
            selectedOpt =
              element.shadowRoot.querySelectorAll(".slds-is-selected");
            opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
            expect(input.value).toBe("3 options selected");
            expect(selectedOpt.length).toBe(3);
            expect(pillIcon.length).toBe(3);
            expect(pillIcon[0].iconName).toBe("standard:user");
            opt[1].click();
            opt[0].click();
            opt[2].click();
          })
          .then(() => {
            input = element.shadowRoot.querySelector("input");
            selectedOpt =
              element.shadowRoot.querySelectorAll(".slds-is-selected");
            expect(input.value).toBe("three");
            expect(selectedOpt.length).toBe(1);
            expect(
              element.shadowRoot.querySelector("[data-name='3']").classList
            ).toContain("slds-is-selected");
            element.value = ["1", "4"];
            return flushPromises().then(() => {
              input = element.shadowRoot.querySelector("input");
              selectedOpt =
                element.shadowRoot.querySelectorAll(".slds-is-selected");
              expect(input.value).toBe("2 options selected");
              expect(selectedOpt.length).toBe(2);
              expect(
                element.shadowRoot.querySelector("[data-name='1']").classList
              ).toContain("slds-is-selected");
              expect(
                element.shadowRoot.querySelector("[data-name='4']").classList
              ).toContain("slds-is-selected");
            });
          });
      });
    });
  });

  it("test with different inputs of options", () => {
    const element = createElement("c-multiselect-combobox", {
      is: MultiselectCombobox
    });
    document.body.appendChild(element);
    return flushPromises().then(() => {
      let opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
      let input = element.shadowRoot.querySelector("input");
      const pill = element.shadowRoot.querySelector("lightning-pill");
      expect(opt.length).toBe(0);
      expect(input.disabled).toBe(false);
      expect(input.value).toBe("Select an Option");
      expect(pill).toBeNull();
      element.pills = true;
      element.options = "Options";
      return flushPromises().then(() => {
        let pills = element.shadowRoot.querySelectorAll("lightning-pill");
        opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
        let combobox = element.shadowRoot.querySelector(".slds-combobox");
        let selectedOpt =
          element.shadowRoot.querySelectorAll(".slds-is-selected");
        expect(pills.length).toBe(0);
        expect(input.value).toBe("Select an Option");
        expect(opt.length).toBe(0);
        expect(combobox.classList).not.toContain("slds-is-open");
        expect(selectedOpt.length).toBe(0);
        element.options = [
          { label: "one", value: "1" },
          { label: "two", valu: "2" },
          { label: "three", value: "3" },
          { label: "four", value: "4" }
        ];
        return flushPromises().then(() => {
          pills = element.shadowRoot.querySelectorAll("lightning-pill");
          opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
          selectedOpt =
            element.shadowRoot.querySelectorAll(".slds-is-selected");
          expect(pills.length).toBe(0);
          expect(input.value).toBe("Select an Option");
          expect(opt.length).toBe(0);
          expect(selectedOpt.length).toBe(0);
          element.options = { label: "one", value: "1" };
          return flushPromises().then(() => {
            pills = element.shadowRoot.querySelectorAll("lightning-pill");
            opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
            selectedOpt =
              element.shadowRoot.querySelectorAll(".slds-is-selected");
            expect(pills.length).toBe(1);
            expect(input.value).toBe("one");
            expect(opt.length).toBe(1);
            expect(element.value).toEqual(["1"]);
            expect(selectedOpt.length).toBe(1);
            element.options = [];
            return flushPromises().then(() => {
              pills = element.shadowRoot.querySelectorAll("lightning-pill");
              opt = element.shadowRoot.querySelectorAll(
                "li.slds-listbox__item"
              );
              selectedOpt =
                element.shadowRoot.querySelectorAll(".slds-is-selected");
              expect(pills.length).toBe(0);
              expect(input.value).toBe("Select an Option");
              expect(opt.length).toBe(0);
              expect(selectedOpt.length).toBe(0);
            });
          });
        });
      });
    });
  });
});
