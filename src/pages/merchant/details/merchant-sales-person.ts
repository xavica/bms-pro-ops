import { MerchantService } from './../../../services/merchant.service';
import { inject } from "aurelia-framework";
import { isValidAddress, isValidMobileNumber, MerchantBusinessType, toCustomArray } from "../../../common";
import { Merchant } from "../../../entities";
import { IMerchantSalesPerson } from "../../../models/sales-person";
import { CompanyService, DistributorService } from "../../../services";
import { SalesPersonService } from "../../../services/sales-person.service";
import { ICompany } from '../../../models/company';



@inject(DistributorService, SalesPersonService, MerchantService, CompanyService)

export class MerchantSalesPerson {
    merchant: Merchant = new Merchant();
    merchantSalesPersons: Array<any> = [];
    salesPersonSearchResultFound: boolean;
    showCreateSalesPersonView: boolean;
    createSalePersonName: string = '';
    distributorCount: number;
    selectedSalesPerson: any;
    merchantSearchDistributorsList: any;
    currentPage: number = 1;
    totalPages: number;
    isLoading: boolean;
    viewDistributorList: any;
    pageNumberBeforeSearch: number;
    distributorName: string;
    salesPerson: any;
    salesPersonMobileNum: string;
    isSalesperson: boolean;
    isCustomer: boolean;
    salesPersons: any = [];
    isManufacturer: boolean;
    showAddButton: boolean = true;


    constructor(private distributorService: DistributorService,
        private salesPersonService: SalesPersonService,
        private merchantService: MerchantService,
        private companyService: CompanyService,) { }

    async activate(model: Merchant) {
        this.isLoading = true;
        this.merchant = model;
        this.showAddButton = this.merchant.businessTypeId == MerchantBusinessType.Manufacturer ? true : this.merchant.vrsMappingInfo != undefined;
        this.merchantSalesPersons = this.mapSalesPerson(this.merchant);
        this.isManufacturer = +this.merchant.businessTypeId == 2 ? true : false;
        this.isLoading = false;
    }


    async getSalesPersonByMobileNumber(mobileNumber: string) {
        try {
            if (!isValidMobileNumber(mobileNumber)) {
                swal("", "Enter Valid Mobile Number. ", 'warning');

                this.salesPersonSearchResultFound = false;
                this.showCreateSalesPersonView = false;
                this.createSalePersonName = '';

                return
            }
            if (mobileNumber) {
                const response = await this.salesPersonService.salesPersonByMobileNumber(mobileNumber);

                if (response == null) {
                    this.salesPersonSearchResultFound = false;

                    this.showCreateSalesPersonView = true;

                    return;
                };

                this.showCreateSalesPersonView = false;
                this.salesPerson = response;
                this.salesPersonSearchResultFound = true;
            }

        } catch (error) {
            console.log("error ::::", error);
        }
    }

    async addSalesPerson(salesPerson: any = {}) {

        this.isLoading = true;
        if (this.merchant.businessTypeId === MerchantBusinessType.Manufacturer) {

            const response = await this.salesPersonService.addSalesPersonToManufacture(salesPerson.id,
                salesPerson.name, salesPerson.mobileNumber, { id: this.merchant.id, name: this.merchant.businessName, type: this.merchant.businessTypeId });
            this.closeSalePersonSearchPopUp();
        } else {
            const response = await this.salesPersonService.addSalesPersonToDistributor({
                id: salesPerson.id,
                name: salesPerson.name,
                mobileNumber: salesPerson.mobileNumber
            }, this.merchant.id, this.merchant.vrsMappingInfo
            );
            this.closeSalePersonSearchPopUp();

        }
        swal("", "Sales Person Created Successfully. ", "success");
        await this.refreshMerchantSalesPerson();
        this.salesPersonSearchResultFound = false;
        this.isLoading = false;

    }

    async createSalesPerson(name: string, mobileNumber: string) {
        try {
            if (!name) {
                swal("", "Please Enter Name. ", 'warning');

                return
            }
            if (name && mobileNumber) {
                this.isLoading = true;
                const vrsMappingKeys = this.merchant.businessTypeId == MerchantBusinessType.Manufacturer ? null : this.merchant.vrsMappingInfo;
                const response = await this.salesPersonService.createSalesPerson({ mobileNumber, name },
                    { id: this.merchant.id, name: this.merchant.businessName, type: this.merchant.businessTypeId }, vrsMappingKeys
                );
                this.closeSalePersonSearchPopUp();
                await this.refreshMerchantSalesPerson();
                swal("", "Sales Person Created Successfully. ", "success");

                this.isLoading = false;
            }

        } catch (error) {
            console.log("createSalesPerson Error  ::::", error);
            console.log("mobileNumber ::::", mobileNumber);
        }

    }

    async deleteSalesPerson(salesPerson: IMerchantSalesPerson) {
        try {
            this.isLoading = true;

            if (this.merchant.businessTypeId == MerchantBusinessType.Manufacturer) {
                const distributorsList: string[] = Array.isArray(salesPerson.distributors) ? salesPerson.distributors.map((d) => d.id) : toCustomArray(salesPerson.distributors).map((d) => d.id);
                const response = await this.salesPersonService.deleteManufactureSalesPerson(salesPerson.id, this.merchant.id, distributorsList);

            } else {
                const response = await this.salesPersonService.deleteDistributorSalesPerson(salesPerson.id, this.merchant.id, this.merchant.vrsMappingInfo);
            }
            swal("", "Sales Person Deleted Successfully. ", "success");
            this.isLoading = false;
            await this.refreshMerchantSalesPerson();

        } catch (error) {

            console.log('Merchant Sales person deleteSalesPerson error ::: ', error);
        }

    }

    async deleteDistributorFromManufactureSalesPerson(salesPersonId: string, distributorId: string) {

        try {
            this.isLoading = true;
            const response = await this.salesPersonService.deleteDistributorFromManufactureSalesPerson(salesPersonId, this.merchant.id, distributorId);

            this.isLoading = false;
            swal("", "Sales Person Deleted Successfully. ", "success");
            this.closeSalesPersonDetails()
            await this.refreshMerchantSalesPerson();
        } catch (error) {

            console.log('deleteDistributorFromManufactureSalesPerson error ', error);
        }
    }


    async getDistributors() {
        try {
            this.isLoading = true;
            this.closeSalesPersonDetails();
            this.merchantSearchDistributorsList = await this.distributorService.getManufactureDistributors(this.merchant.companies.map((c) => c.id));
            this.openSearchDistributorPopUp();
            this.merchantSearchDistributorsList.forEach((d) => {
                d["isSelected"] = false;
                d['searchKey'] = d.name.toLocaleLowerCase().replace(/\s/g, '');
            });
            this.refreshDistributors();
        } catch (error) {

        }
    }

    //#region  private methods
    private getPageCount(distributor: Array<ICompany>) {
        this.distributorCount = distributor.length;
        let pageCount = this.distributorCount / 10;
        this.totalPages = Number.isInteger(pageCount) ? pageCount : Math.trunc(pageCount + 1);
    }

    private async refreshDistributors() {
        const merchantMappedDistributorIds: Array<string> = this.selectedSalesPerson.distributors.map((c) => c.id);
        this.viewDistributorList = this.merchantSearchDistributorsList.filter((c) => !merchantMappedDistributorIds.includes(c.id)).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        await this.getPageCount(this.viewDistributorList);

        this.isLoading = false;
    }

    private mapSalesPerson(merchant: Merchant) {
        const salesPersons: Array<IMerchantSalesPerson> = merchant.salesPersons || [];

        return salesPersons.map((s) => {

            const distributors: any[] = merchant.businessTypeId === MerchantBusinessType.Manufacturer ? toCustomArray(s.distributors) : [{ id: merchant.id, name: merchant.businessName, vrsId: s.erpSalesPersonId }]
            return {
                erpSalesPersonId: s.erpSalesPersonId,
                id: s.id,
                mobilenumber: s.mobilenumber,
                name: s.name,
                distributors: distributors,
                count: distributors.length
            }
        })
    }

    private async refreshMerchantSalesPerson() {
        const merchant = await this.merchantService.getUser(this.merchant.id);
        this.merchantSalesPersons = this.mapSalesPerson(merchant)
    }

    //#endregion





    async saveMerchantDistributor() {
        try {
            this.isLoading = true;
            const selectedDistributor: Array<Merchant> = this.merchantSearchDistributorsList.filter((d) => d.isSelected);
            if (selectedDistributor.length == 0) {

                swal("", "please select  one or more distributor. ", "warning");

                return;
            }

            const salesPerson = {
                id: this.selectedSalesPerson.id,
                name: this.selectedSalesPerson.name,
                mobileNumber: this.selectedSalesPerson.mobilenumber
            }
            for (const distributor of selectedDistributor) {

                const response = await this.salesPersonService.addDistributorToManufactureSalesPerson(salesPerson, distributor.id, { id: this.merchant.id, name: this.merchant.businessName });
            }
            swal("", "Distributor tagged Successfully. ", "success");
            this.isLoading = false;
            this.closeDistributorSearchPopUp();
            await this.refreshMerchantSalesPerson();

        } catch (error) {
            swal("", "Unable to add the Distributor", "error");

            console.log("Error While Saving Companies :::", error);
        }
    }


    //#region Private methods

    viewSelectedDistributor() {
        this.viewDistributorList = this.merchantSearchDistributorsList.filter((c) => c.isSelected);
        if (this.viewDistributorList.length == 0) {
            swal("", "Select At least One Distributor.", 'warning');
            this.clearSearch();

            return
        } else {

            this.pageNumberBeforeSearch = this.currentPage;
            this.currentPage = 1;
            this.getPageCount(this.viewDistributorList);
        }

    }

    searchDistributor(distributorSearchName: string) {
        if (!isValidAddress(distributorSearchName)) {
            swal("", "Search Valid Text.", 'warning');

            return
        }

        if (distributorSearchName) {
            this.viewDistributorList = this.merchantSearchDistributorsList.filter(d => d.searchKey.includes(distributorSearchName.toLocaleLowerCase()));
            if (this.viewDistributorList == 0) {
                swal("", "Distributor not Found.", 'warning');
                this.getPageCount(this.viewDistributorList);

                return
            } else {
                this.pageNumberBeforeSearch = this.currentPage;
                this.currentPage = 1;
                this.getPageCount(this.viewDistributorList);
            }
        }
    }
    clearSearch() {
        this.distributorName = '';
        this.pageNumberBeforeSearch = this.currentPage;
        this.viewDistributorList = this.merchantSearchDistributorsList;
        this.getPageCount(this.viewDistributorList);


    }
    setNextPage() {
        this.currentPage = this.totalPages > this.currentPage ? this.currentPage += 1 : this.currentPage
    }

    setPreviousPage() {
        this.currentPage = this.currentPage > 1 ? this.currentPage -= 1 : 1
    }



    openSalePersonSearchPopUp() {
        this.salesPersonSearchResultFound = false;
        this.showCreateSalesPersonView = false;
        this.salesPersonMobileNum = '';
        this.createSalePersonName = '';
        let x = document.getElementById("addSalesPersonPopUp");
        x!.style.display = "block";
        let y = document.getElementById("shadow3");
        y!.style.display = "block";
    }
    closeSalePersonSearchPopUp() {
        let x = document.getElementById("addSalesPersonPopUp");
        x!.style.display = "none";
        let y = document.getElementById("shadow3");
        y!.style.display = "none";
    }

    openSearchDistributorPopUp() {
        this.distributorName = '';
        let x = document.getElementById("searchDistributorPopUp");
        x!.style.display = "block";
        let y = document.getElementById("shadow3");
        y!.style.display = "block";
    }
    closeDistributorSearchPopUp() {
        this.isLoading = false;
        let x = document.getElementById("searchDistributorPopUp");
        x!.style.display = "none";
        let y = document.getElementById("shadow3");
        y!.style.display = "none";
    }


    async showSalesPersonDetails(salesPersonDetails) {
        this.selectedSalesPerson = salesPersonDetails;
        let x = document.getElementById("showSalesPersonPopUp");
        x!.style.display = "block";
        let y = document.getElementById("shadow3");
        y!.style.display = "block";

    }

    closeSalesPersonDetails() {
        let x = document.getElementById("showSalesPersonPopUp");
        x!.style.display = "none";
        let y = document.getElementById("shadow3");
        y!.style.display = "none";
    }

    //#endregion

}
