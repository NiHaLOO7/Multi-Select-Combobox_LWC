import { LightningElement, api, track } from 'lwc';

export default class MultiselectCombobox extends LightningElement {

    @api label = "";

    @track selectedOptions = [];                // list of all the selected options
    @track inputValue;                          // label that is shown in the input of the combobox
    @track inputOptions;                        // List of all the options
    
    // Flags
    @track hasRendered;
    @track dropDownInFocus = false;

    // flags that are passed from parents.
    @track _disabled = false;                   // Flag to know if the combobox should be disabled or not 
    @track _pills = false;                      // Flag to know if the pills should be visible or not
    @track _isNoSelectionAllowed = false;       // Flag to know if zero selection should be allowed in the combobox or not
    @track _pillIcon = false;                   // Pill's Icon

    @api
    get disabled(){
        return this._disabled;
    }
    set disabled(value){
        this._disabled = value;
        this.handleDisabled();
    }

    @api
    get pills(){
        return this._pills;
    }
    set pills(value){
        this._pills = value;
    }

    @api
    get zeroSelectionAllowed(){
        return this._isNoSelectionAllowed;
    }
    set zeroSelectionAllowed(value){
        this._isNoSelectionAllowed = value;
    }
    
    @api
    get options() {
        return this.inputOptions;
    }
    set options(value) {
        let options = [];
        this.inputOptions = options.concat(value);
    }

    @api
    get pillIcon(){
        return this._pillIcon;
    }
    set pillIcon(value){
        this._pillIcon = value;
    }
    
    

    renderedCallback() {
        if (!this.hasRendered) {
            //  we call this logic only once, when page is rendered for the first time
            this.handleDisabled();
            this.setInitialValue(); 
        }
        this.hasRendered = true;
    }

    setInitialValue(){
        this.inputValue = this.options[0].label;
        this.selectedOptions = [this.options[0]];
        let firstOption = this.template.querySelectorAll('li.slds-listbox__item')[0];
        firstOption.firstChild.classList.add("slds-is-selected");
        let values=[this.options[0].value];
        this.dispatchEvent(new CustomEvent("valuechange", {
            detail: values
        }));
    }

    handleDisabled(){
        let input = this.template.querySelector("input");
        if (input){
            input.disabled = this.disabled;
            this._pills = this.pills && this.disabled ? !this.disabled : this._pills;  //Remove pills when disabled
        }
    }

    
    handleClick() {
        let sldsCombobox = this.template.querySelector(".slds-combobox");
        sldsCombobox.classList.toggle("slds-is-open");
    }

    handleSelection(event) {
        let value = event.currentTarget.dataset.value;
        let selectedListBoxOptions = this.template.querySelectorAll('.slds-is-selected');
        if(!(selectedListBoxOptions.length === 1 && selectedListBoxOptions[0].dataset.name === value) || this.zeroSelectionAllowed){
            this.handleOption(event, value);
        }
        let input = this.template.querySelector("input");
        input.focus();
    }

    // Dispatch event to send value to the parent on every change event
    sendValues(){
        let values = [];
        for (const valueObject of this.selectedOptions) {
            values.push(valueObject.value);
        }
        this.dispatchEvent(new CustomEvent("valuechange", {
            detail: values
        }));
    }

    handleOption(event, value){
        let listBoxOption = event.currentTarget.firstChild;
        if (listBoxOption.classList.contains("slds-is-selected")) {
            this.selectedOptions = this.selectedOptions.filter(option => option.value !== value);
        }
        else {
            let option = this.options.find(option => option.value === value);
            this.selectedOptions.push(option);
        }
        this.setInputValue();    
        listBoxOption.classList.toggle("slds-is-selected");
        this.sendValues();
    }

    setInputValue(){
        if (this.selectedOptions.length > 1) {
            this.inputValue = this.selectedOptions.length + ' options selected';
        }
        else if(this.selectedOptions.length === 1){
            this.inputValue = this.selectedOptions[0].label;
        }
        else{
            this.inputValue = 'No option selected';
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
     
    removePill(event){
        let deletedValue = event.detail.name;
        if(!(this.selectedOptions.length === 1) || this.zeroSelectionAllowed){
            this.unselectTheOption(deletedValue);
        }
     }
 
     unselectTheOption(deletedValue){
         this.selectedOptions = this.selectedOptions.filter(option => option.value !== deletedValue);
         this.setInputValue();
         this.template.querySelector(`[data-name="${deletedValue}"]`).classList.remove("slds-is-selected");
         this.sendValues();
     }
     
 
}