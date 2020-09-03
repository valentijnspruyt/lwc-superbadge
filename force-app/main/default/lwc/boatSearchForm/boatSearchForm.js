// imports
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import { LightningElement, track, wire } from "lwc";

export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";

  // Private
  error = undefined;

  // Needs explicit track due to nested data
  @track searchOptions = [];

  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map((type) => {
        return {
          label: type.Name,
          value: type.Id
        };
      });
      this.searchOptions.unshift({ label: "All Types", value: "" });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }

  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;
    const searchEvent = new CustomEvent("search", {detail: {boatTypeId : this.selectedBoatTypeId}});
    this.dispatchEvent(searchEvent);
  }
}
