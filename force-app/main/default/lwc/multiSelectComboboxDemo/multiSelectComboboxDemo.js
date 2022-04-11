import { LightningElement, track } from 'lwc';

export default class MultiSelectComboboxDemo extends LightningElement {
    @track cbOptions = [{label:"one", value:"1"},
                        {label:"two", value:"2"},
                        {label:"three", value:"3"},
                        {label:"four", value:"4"}]
    @track pills = true;
    @track disabled = false;
    @track zeroSelectionFlag = false;

    handleValueChange(event){
        console.log(JSON.stringify(event.detail));
    }
}