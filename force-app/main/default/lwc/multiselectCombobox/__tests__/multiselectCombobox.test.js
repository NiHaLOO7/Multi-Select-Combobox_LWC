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
                element.shadowRoot.querySelector("[data-name='2']").classList
              ).not.toContain("slds-is-selected");
              expect(
                element.shadowRoot.querySelector("[data-name='3']").classList
              ).not.toContain("slds-is-selected");
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

  it("test ZeroSelectionAllowed function and pills removing function", () => {
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
      element.value = ["1", "2", "3", "4"];
      element.options = [
        { label: "one", value: "1" },
        { label: "two", value: "2" },
        { label: "three", value: "3" },
        { label: "four", value: "4" },
        { label: "five", value: "5" }
      ];
      element.zeroSelectionAllowed = false;
      return flushPromises().then(() => {
        let pills = element.shadowRoot.querySelectorAll("lightning-pill");
        let pillIcon = element.shadowRoot.querySelector(
          "lightning-pill lightning-icon"
        );
        opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
        let combobox = element.shadowRoot.querySelector(".slds-combobox");
        let selectedOpt =
          element.shadowRoot.querySelectorAll(".slds-is-selected");
        expect(pills.length).toBe(4);
        expect(pills[0].label).toBe("one");
        expect(pills[1].label).toBe("two");
        expect(pills[2].label).toBe("three");
        expect(pills[3].label).toBe("four");
        expect(pillIcon).toBeNull();
        expect(input.value).toBe("4 options selected");
        expect(opt.length).toBe(5);
        expect(combobox.classList).not.toContain("slds-is-open");
        expect(selectedOpt.length).toBe(4);
        expect(
          element.shadowRoot.querySelector("[data-name='1']").classList
        ).toContain("slds-is-selected");
        expect(
          element.shadowRoot.querySelector("[data-name='2']").classList
        ).toContain("slds-is-selected");
        expect(
          element.shadowRoot.querySelector("[data-name='3']").classList
        ).toContain("slds-is-selected");
        expect(
          element.shadowRoot.querySelector("[data-name='4']").classList
        ).toContain("slds-is-selected");
        pills[3].dispatchEvent(
          new CustomEvent("remove", {
            detail: {
              name: "4"
            }
          })
        );
        pills[1].dispatchEvent(
          new CustomEvent("remove", {
            detail: {
              name: "2"
            }
          })
        );
        pills[2].dispatchEvent(
          new CustomEvent("remove", {
            detail: {
              name: "3"
            }
          })
        );
        pills[0].dispatchEvent(
          new CustomEvent("remove", {
            detail: {
              name: "1"
            }
          })
        );
        return flushPromises().then(() => {
          pills = element.shadowRoot.querySelectorAll("lightning-pill");
          input = element.shadowRoot.querySelector("input");
          selectedOpt =
            element.shadowRoot.querySelectorAll(".slds-is-selected");
          opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
          expect(input.value).toBe("one");
          expect(selectedOpt.length).toBe(1);
          expect(pills.length).toBe(1);
          expect(pills[0].label).toBe("one");
          expect(
            element.shadowRoot.querySelector("[data-name='1']").classList
          ).toContain("slds-is-selected");
          expect(
            element.shadowRoot.querySelector("[data-name='2']").classList
          ).not.toContain("slds-is-selected");
          expect(
            element.shadowRoot.querySelector("[data-name='3']").classList
          ).not.toContain("slds-is-selected");
          expect(
            element.shadowRoot.querySelector("[data-name='4']").classList
          ).not.toContain("slds-is-selected");
          element.value = ["1", "3"];
          element.zeroSelectionAllowed = true;
          return flushPromises().then(() => {
            pills = element.shadowRoot.querySelectorAll("lightning-pill");
            input = element.shadowRoot.querySelector("input");
            selectedOpt =
              element.shadowRoot.querySelectorAll(".slds-is-selected");
            opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
            expect(input.value).toBe("2 options selected");
            expect(selectedOpt.length).toBe(2);
            expect(pills.length).toBe(2);
            expect(pills[0].label).toBe("one");
            expect(pills[1].label).toBe("three");
            expect(
              element.shadowRoot.querySelector("[data-name='1']").classList
            ).toContain("slds-is-selected");
            expect(
              element.shadowRoot.querySelector("[data-name='2']").classList
            ).not.toContain("slds-is-selected");
            expect(
              element.shadowRoot.querySelector("[data-name='3']").classList
            ).toContain("slds-is-selected");
            expect(
              element.shadowRoot.querySelector("[data-name='4']").classList
            ).not.toContain("slds-is-selected");
            input.click();
            expect(combobox.classList).toContain("slds-is-open");
            opt[0].click();
            opt[2].click();
            return flushPromises().then(() => {
              selectedOpt =
                element.shadowRoot.querySelectorAll(".slds-is-selected");
              pills = element.shadowRoot.querySelectorAll("lightning-pill");
              input = element.shadowRoot.querySelector("input");
              expect(input.value).toBe("Select an Option");
              expect(pills.length).toBe(0);
              expect(selectedOpt.length).toBe(0);
              expect(
                element.shadowRoot.querySelector("[data-name='1']").classList
              ).not.toContain("slds-is-selected");
              expect(
                element.shadowRoot.querySelector("[data-name='2']").classList
              ).not.toContain("slds-is-selected");
              expect(
                element.shadowRoot.querySelector("[data-name='3']").classList
              ).not.toContain("slds-is-selected");
              expect(
                element.shadowRoot.querySelector("[data-name='4']").classList
              ).not.toContain("slds-is-selected");
            });
          });
        });
      });
    });
  });

  it("test onblur click event of the option list", () => {
    const element = createElement("c-multiselect-combobox", {
      is: MultiselectCombobox
    });
    document.body.appendChild(element);
    return flushPromises().then(() => {
      let opt = element.shadowRoot.querySelectorAll("li.slds-listbox__item");
      let input = element.shadowRoot.querySelector("input");
      const pill = element.shadowRoot.querySelector("lightning-pill");
      let combobox = element.shadowRoot.querySelector(".slds-combobox");
      expect(opt.length).toBe(0);
      expect(input.disabled).toBe(false);
      expect(input.value).toBe("Select an Option");
      expect(combobox.classList).not.toContain("slds-is-open");
      expect(pill).toBeNull();
      element.pills = true;
      element.value = ["1", "2", "3", "4"];
      element.options = [
        { label: "one", value: "1" },
        { label: "two", value: "2" },
        { label: "three", value: "3" },
        { label: "four", value: "4" },
        { label: "five", value: "5" }
      ];
      element.zeroSelectionAllowed = true;
      return flushPromises().then(() => {
        combobox = element.shadowRoot.querySelector(".slds-combobox");
        input = element.shadowRoot.querySelector("input");
        let dropdown = element.shadowRoot.querySelector("div.slds-dropdown");
        input.click();
        expect(combobox.classList).toContain("slds-is-open");
        dropdown.dispatchEvent(new CustomEvent("mouseenter"));
        return flushPromises().then(() => {
          input = element.shadowRoot.querySelector("input");
          input.dispatchEvent(new CustomEvent("blur"));
          return flushPromises().then(() => {
            combobox = element.shadowRoot.querySelector(".slds-combobox");
            expect(combobox.classList).toContain("slds-is-open");
            dropdown = element.shadowRoot.querySelector("div.slds-dropdown");
            dropdown.dispatchEvent(new CustomEvent("mouseleave"));
            return flushPromises().then(() => {
              input = element.shadowRoot.querySelector("input");
              input.dispatchEvent(new CustomEvent("blur"));
              return flushPromises().then(() => {
                combobox = element.shadowRoot.querySelector(".slds-combobox");
                expect(combobox.classList).not.toContain("slds-is-open");
              });
            });
          });
        });
      });
    });
  });
});
