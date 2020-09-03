import { LightningElement, track, wire } from 'lwc';
import refreshApex from '@salesforce/apex';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = [];
    boatTypeId = '';
    boats;
    isLoading = false;

    @track wiredBoatsResult;

    // wired message context
    messageContext = createMessageContext();

    @wire(getBoats,{boatTypeId:"$boatTypeId"})
    wiredBoats(result) { 
        //TODO: set boats
        this.wiredBoatsResult = result;
        this.boats = result.data;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    async searchBoats(boatTypeId) { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = true;
    }
    
    refresh() { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        refreshApex(this.wiredBoatsResult);
    }

    get showTiles()
    {
        return this.boats != undefined && this.boats.length > 0;
    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) { 
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) { 
        const message = {
            //TODO
            // recordId: "some string",
            // recordData: { value: "some value" }
        };
        publish(this.messageContext, BOATMC, message);
    }

    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave() {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput =>
                //update boat record
                {}
            );
        Promise.all(promises)
            .then(() => {})
            .catch(error => {})
            .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        const eventName = isLoading ? 'loading' : 'doneloading';
        const loadingEvent = new CustomEvent(eventName);
        this.dispatchEvent(loadingEvent);
    }

    disconnectedCallback()
    {
        releaseMessageContext(this.messageContext);
    }
}
  