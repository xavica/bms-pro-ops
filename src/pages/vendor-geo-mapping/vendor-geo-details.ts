import { inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState } from '../../common';
import { BootstrapFormRenderer } from '../../bootstrap-validation';
import { ValidationController } from 'aurelia-validation';
import * as XLSX from 'xlsx';
import { GeoService } from '../../services';

@inject(Router, ApplicationState, NewInstance.of(ValidationController), GeoService)
export class VendorGeoMapping {
  bootStrapRenderer: BootstrapFormRenderer;
  merchantDetails: any;
  merchantId: any;
  isLoader: boolean = false;
  fileVal: any;
  txtJson: string = '{}';
  jsonGeoData: string;
  companiesList: Array<any> = [];
  locationsList: Array<any> = [];
  selectedCompaniesList: Array<any> = [];
  selectAll: boolean = false;
  sideHeader: string = "";
  sideHeaderIndex: number = 0;
  selectedFiles: any;
  singlelocation: Array<any> = [];
  selectedLocationId: number | null = null;
  isOverlappedCompanies: boolean = false;
  mappingConflict: Array<any> = [];
  locationMappedCompaniesList: Array<string> = [];
  isLoading: boolean = false;

  constructor(private router: Router,
    private appState: ApplicationState,
    private controller: ValidationController,
    private geoService: GeoService,
  ) {
  }
  async activate() {
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
    this.isLoader = true;
    this.merchantDetails = this.appState.merchant;
    if (this.merchantDetails) {
      this.merchantId = await this.getMerchantId(this.merchantDetails.id) || 0;
      this.companiesList = this.formatCompanies(this.appState.merchant["companies"]) || [];
      await this.getLocations(this.merchantId);
    }
    this.isLoader = false;
  }
  private formatCompanies(companies: Array<any>) {
    let formattedCompanies = companies.map((data) => {
      return {
        "id": data.id,
        "locationId": 0,
        "vendorId": this.merchantId,
        "vendorRefId": this.merchantDetails.id,
        "vendorName": this.merchantDetails.businessName,
        "vendorTypeId": this.merchantDetails.businessTypeId,
        "name": data.name,
        "isSelected": false
      }
    });
    return formattedCompanies;
  }
  async getMerchantId(merchantRefId: string) {
    try {
      return this.geoService.getMerchantId(merchantRefId);
    } catch (error) {
      swal("", "Something went wrong while processing your request.Please try again after some time.", "warning");
      return 0;
    }
  }
  async getLocations(merchantId: string) {
    try {
      let locationsList = await this.geoService.getLocations(merchantId);
      this.locationsList = locationsList || [];
      const companiesList: Array<any> = [].concat.apply([], this.locationsList.map((l) => l.companyNames));
      this.locationMappedCompaniesList = [].concat.apply([], companiesList.filter(Boolean));
    } catch (error) {
      swal("", "Something went wrong while processing your request.Please try again after some time.", "warning");
    }
  }
  goBack() {
    this.router.navigateBack();
  }
  private getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  private isValidFile(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'geojson':
      case 'json':
        //etc
        return true;
    }
    return false;
  }
  private isValidFormat() {
    if (this.jsonGeoData["features"] && this.jsonGeoData["features"].length) {
      let inValidCount = this.jsonGeoData["features"].filter((data) => data.properties && data.properties.location == "").length;
      if (!inValidCount) {
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }
  async onSelectFile(evt) {
    let file: any = evt.target.files[0]
    if (!file) {
      swal("Warning!", "Please upload the file!", "warning");
      this.fileVal = null;
      return;
    }
    if (file && !this.isValidFile(file.name)) {
      swal("Warning!", "Invalid File Format!!", "warning");
      this.fileVal = null;
      return;
    }
    var reader = new FileReader();
    if (evt.target.files && evt.target.files[0]) {
      var reader = new FileReader();
      reader.readAsText(evt.target.files[0]);
      reader.onload = (event: ProgressEvent) => {
        try {
          this.txtJson = ((<FileReader>event.target).result || '{}').toString();
          this.jsonGeoData = JSON.parse(this.txtJson);
          if (!this.isValidFormat()) {
            swal("Warning!", "Invalid File Values!!", "warning");
            this.selectedFiles = null;
            this.fileVal = null;
            return;
          }
        } catch {
          swal("", "Invalid File", "error");
        }

      }

    }
  }

  async updateSelectedLocationPolygonOrCompanies(selectedFiles: any) {
    const companiesList = this.selectedCompaniesList.filter((data) => !data.isSelected);
    if (companiesList.length && selectedFiles) {
      selectedFiles = null;
      this.selectedFiles = null;
      swal("", "select only one option either unmap Companies or upload file", "warning");
      return;
    }

    if (!selectedFiles) {
      await this.unmapCompanies();
    } else {
      await this.getSingleLocationData();
    }

  }

  async saveGeoData() {
    try {
      if (Object.keys(this.jsonGeoData).length > 0) {
        await this.geoService.saveGeoJson(this.merchantId, this.jsonGeoData);
        //user activity log
        await this.getLocations(this.merchantId);
        this.fileVal = null;
        swal("Uploaded!", "Uploaded Geo JSON Successfully", "success");
      }
    } catch (error) {
      swal("", "Something went wrong while processing your request.Please try again after some time.", "warning");
    }
  }
  async mapCompanies() {
    this.mappingConflict = [];
    this.isOverlappedCompanies = false;
    try {
      let companiesList = this.selectedCompaniesList.filter((data) => data.isSelected);
      if (companiesList.length == 0) {
        swal("", "Didn't have any changes to save", "warning");
      }
      else {
        await this.geoService.mapCompanies(companiesList);
        //user activity log
        await this.getLocations(this.merchantId);
        swal("", "Added companies successfully", "success");
        this.sideDrawerNav();
      }
    } catch (error) {
      if (error.status === 409) {
        const responce = await error.json();
        if (responce && responce.data) {
          this.mappingConflict = responce.data;
          if (this.mappingConflict) {
            let errorMessages = this.mappingConflict.map(conflict => {
              let errorMessage = `This area is being served by ` + conflict.vendorName + ' for ' + conflict.companyName;
              return errorMessage;
            });
            let consolidatedMessage = errorMessages.join(', ');
            alert(consolidatedMessage);
          }
          this.sideDrawerNav();
        }
      } else {
        swal("", "Something went wrong while processing your request.Please try again after some time.", "warning");
        this.sideDrawerNav();
      }

    }
  }
  async unmapCompanies() {
    try {
      let companiesList = this.selectedCompaniesList.filter((data) => !data.isSelected);
      if (companiesList.length == 0) {
        swal("", "Didn't have any changes to save", "warning");
      }
      else {
        await this.geoService.unmapCompanies(companiesList);
        //user activity log
        await this.getLocations(this.merchantId);
        swal("", "Removed companies successfully", "success");
        this.sideDrawerNav()
      }

    } catch (error) {
      swal("", "Something went wrong while processing your request.Please try again after some time.", "warning");
      this.sideDrawerNav()
    }

  }
  async openSideDrawer(companyIds, index, selectedLocationId) {
    this.selectedCompaniesList = [];
    if (!index) {
      this.sideHeader = "Add";
      this.sideHeaderIndex = index;
      this.selectAll = false;
      this.companiesList.map((data) => {
        if (companyIds[0].indexOf(data.id) == -1) {
          data.isSelected = false;
          data.locationId = selectedLocationId;
          this.selectedCompaniesList.push(data);
        }
      });
    }
    else {
      this.sideHeader = "Update";
      this.sideHeaderIndex = index;
      this.selectAll = true;
      this.selectedLocationId = selectedLocationId;
      this.companiesList.map((data) => {
        if (companyIds[0].indexOf(data.id) >= 0) {
          data.isSelected = true;
          data.locationId = selectedLocationId;
          this.selectedCompaniesList.push(data);
        }
      });
    }
    this.sideDrawerNav();
  }
  async sideDrawerNav() {
    this.selectedFiles = null;
    this.fileVal = null;
    let x = document.getElementById("sidenav");
    if (x!.style.display == "none") {
      x!.style.display = "block";
    } else {
      x!.style.display = "none";
    }
  }

  async getSingleLocationData() {
    this.singlelocation = this.locationsList.filter((location) => location.locationId === this.selectedLocationId);
    const companiesList: Array<any> = [].concat.apply([], this.singlelocation.map((l) => l.companyNames));
    const locationMappedCompaniesList: Array<string> = [].concat.apply([], companiesList.filter(Boolean));
    if (locationMappedCompaniesList.length === 0) {
      await this.removeCompanies(false);
      this.sideDrawerNav();
    } else {
      this.side();
    }
  }

  async side(id: string = 'Alertbar') {
    this.selectedFiles = null;
    this.fileVal = null;
    let x = document.getElementById(id);
    if (x!.style.display == "none") {
      x!.style.display = "block";
      this.sideDrawerNav();
    } else {
      x!.style.display = "none";
    }
  }

  selectAllCompanies(select) {
    this.selectAll = select;
    this.companiesList.map((data) => data.isSelected = !data.isSelected);
  }
  async downloadGeoJsonVendor() {
    let geoVendor: any = await this.geoService.geoJsonByVendor(this.merchantId);
    const blob = new Blob([JSON.stringify(geoVendor)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download';
    a.click();
    a.remove();
  }
  async downloadLocationGeoJson(locationId: number, locationName: string) {
    let geoVendor: any = await this.geoService.locationGeoJson(locationId);
    const blob = new Blob([JSON.stringify(geoVendor)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = locationName;
    a.click();
    a.remove();
  }
  async removeCompanies(showSideNave: boolean = true) {
    try {
      await this.saveGeoJsonFile(this.selectedLocationId, showSideNave);
    } catch (error) {
      throw error;
    }
  }
  async saveGeoJsonFile(locationId, showSideNave: boolean = true) {
    try {
      if (Object.keys(this.jsonGeoData).length > 0) {
        await this.geoService.updateLocation(locationId, this.merchantId, this.jsonGeoData);
        //user activity log
        await this.getLocations(this.merchantId);
        if (showSideNave) {
          this.side();
        }
        swal("Uploaded!", "Uploaded Geo JSON and Companies Removed Successfully", "success");
      }
    } catch (error) {
      console.log('error::: ', error)
      let message: string = "Something went wrong while processing your request.Please try again after some time.";
      if (error.status === 400) {
        const responce = await error.json();
        message = responce.message || '';
      }
      this.side();
      swal("", message, "warning");
    }
  }
  async downloadAreaWiseCustomers() {

    try {
      this.isLoading = true;
      let customerList: Array<any> = await this.geoService.getCustomersByVendorGeoArea(this.merchantId);
      if (customerList && customerList.length > 0) {
        let customerListForExcelExport = this.mapCustomersForExcelExport(customerList);
        this.jsonToXcel(customerListForExcelExport);
      } else {
        swal("Data not found!", "", "info");
      }
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      swal("Something went wrong. please try again.", "", "error");
    }

  }
  mapCustomersForExcelExport(customers: Array<any>) {
    return customers.map((customer) => {
      return {
        "Vendor business name": customer.vendorBusinessName,
        "Vendor ID": customer.vendorId,
        "Customer id": customer.customerId,
        "Business name": customer.businessName,
        "Territory/area code": customer.areaCode,
        "Customer number": customer.mobileNumber,
        "Customer name": customer.name,
        "Registered date": customer.registeredDate,
        "Latitude": customer.latitude,
        "Longitude": customer.longitude,
        "Physical Address": customer.address
      }
    });
  }
  private autofitColumns(worksheet: any) {
    let objectMaxLength: any = [{ width: 25 }, { width: 20 }, { width: 20 }, { width: 25 }, { width: 12 }, { width: 12 }, { width: 20 }, { width: 12 }, { width: 18 }, { width: 18 }, { width: 30 }];
    worksheet['!cols'] = objectMaxLength;
  }

  private jsonToXcel(items: Array<any>) {
    let sheetName = `Customers-Under-${this.merchantDetails.mobileNumber}`;
    var workBook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(items);
    this.autofitColumns(worksheet);
    XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);

    var outputFileName = `${sheetName}.xlsx`;
    XLSX.writeFile(workBook, outputFileName);
  }

}
