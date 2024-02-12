import { RoleType, MerchantBusinessType } from './../../../common/enums';
import { inject } from "aurelia-framework";
import { ApplicationState, getSwalMessage, isValidBusinessName, toCustomArray, toCustomObject } from "../../../common";
import { Company, ICompanyFb, Merchant } from "../../../entities";
import { CompanyService } from "../../../services";
import { ICompany } from '../../../models/company';

@inject(CompanyService, ApplicationState)

export class MerchantCompany {

    merchant: Merchant = new Merchant();
    roleTypeId: number;
    merchantCompaniesList: Array<ICompany> = [];
    isSyncBtnVisible: boolean = false;
    showAddButton: boolean = true;
    companiesMasterList: Array<ICompany> = [];
    viewCompaniesList: Array<ICompany> = [];
    companyCount: number;
    totalPages: number;
    currentPage: number = 1;
    nonSearchPreviousPageNum: number;
    companySearchName: string;
    isLoading: boolean;
    constructor(
        private companyService: CompanyService,
        private appState: ApplicationState
    ) {

    }


    async activate(model: Merchant) {
        this.isLoading = true;
        this.merchant = model;
        this.roleTypeId = this.appState.crm.roleTypeId || 0;
        this.visualButtonBasedOnRole();
        this.merchantCompaniesList = this.merchant.companies.sort();
        this.isLoading = false;

    }



    async deleteCompany(companyId: string) {
        const resetMessage: any = getSwalMessage("Remove Company", "Do you want to remove the company?.", "warning")
        swal(resetMessage, async () => {

            if (this.companiesMasterList.length === 0) {
                await this.checkCompanyMasterList();
            }

            const merchantMappedDistributorIds = this.merchantCompaniesList.filter((c) => c.id === companyId);
            this.companiesMasterList.push({ id: merchantMappedDistributorIds[0].id, name: merchantMappedDistributorIds[0].name, isSelected: false, searchKey: merchantMappedDistributorIds[0].name.toLocaleLowerCase().replace(/\s/g, '') });

            await this.companyService.deleteMerchantCompanyInFb(this.merchant.id, companyId);
            swal("", "removed selected company.", "success");
            const deletedCompanyIndex: number = this.merchantCompaniesList.findIndex((c) => c.id === companyId);
            this.merchantCompaniesList.splice(deletedCompanyIndex, 1);
        });

    }

    // popup open and close
    async opeCompanyPopUp() {
        if (this.companiesMasterList.length === 0) {
            await this.checkCompanyMasterList();
        }
        this.companySearchName = '';
        this.companiesMasterList.forEach((c) => {
            c["isSelected"] = false;
            c['searchKey'] = c.name.toLocaleLowerCase().replace(/\s/g, '');
        });
        this.refreshCompaniesList();
        let x = document.getElementById("addCompanyPopup");
        x!.style.display = "block";
        let y = document.getElementById("shadow2");
        y!.style.display = "block";

    }
    async checkCompanyMasterList() {
        //const companiesList: Array<ICompany> = await this.companyService.getCompaniesFb();
        // const companiesList: Array<any> = await this.companyService.getCompaniesPg();
        const companiesList: Array<any> = await this.companyService.getCompaniesItemService();
        const merchantMappedCompanyIds: Array<string> = this.merchantCompaniesList.map((c) => c.id);
        this.companiesMasterList = companiesList.filter((c) => !merchantMappedCompanyIds.includes(c.id));
    }

    closeCompanyPopUp() {
        let x = document.getElementById("addCompanyPopup");
        x!.style.display = "none";
        let y = document.getElementById("shadow2");
        y!.style.display = "none";
    }

    refreshCompaniesList() {
        this.viewCompaniesList = this.companiesMasterList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.getPageCount(this.viewCompaniesList);

    }

    searchCompany(companySearchName: string) {
        if (!companySearchName) {
            swal("", "Please Enter the Company Name.", 'warning');
            return

        }
        if (companySearchName.trim().length > 0) {
            this.viewCompaniesList = this.companiesMasterList.filter(d => d.searchKey.includes(companySearchName.toLocaleLowerCase().replace(/\s/g, '')));
            if (this.viewCompaniesList.length == 0) {
                swal("", "Companies not Found.", 'warning');
                this.getPageCount(this.viewCompaniesList);


                return
            }
            else {
                this.nonSearchPreviousPageNum = this.currentPage;
                this.currentPage = 1;
                this.getPageCount(this.viewCompaniesList);

            }
        } else {
            this.clearSearch();
        }
    }

    viewSelectedCompanies() {
        this.viewCompaniesList = this.companiesMasterList.filter((c) => c.isSelected);
        if (this.viewCompaniesList.length == 0) {
            swal("", "No Companies are Selected.", 'warning');
            this.clearSearch();
            return
        } else {
            this.nonSearchPreviousPageNum = this.currentPage;
            this.currentPage = 1;
            this.getPageCount(this.viewCompaniesList);

        }
    }




    setNextPage() {
        this.currentPage = this.totalPages > this.currentPage ? this.currentPage += 1 : this.currentPage
    }

    setPreviousPage() {
        this.currentPage = this.currentPage > 1 ? this.currentPage -= 1 : 1
    }


    clearSearch() {
        this.companySearchName = '';
        this.currentPage = this.nonSearchPreviousPageNum;
        this.viewCompaniesList = this.companiesMasterList;
        this.getPageCount(this.viewCompaniesList);

    }

    async saveMerchantCompanies() {
        try {
            const selectedCompanies: Array<ICompany> = this.viewCompaniesList.filter((c) => c.isSelected);
            if (selectedCompanies.length == 0) {
                swal("", "Select At least One Company.", 'warning');

                return
            } else {
                this.isLoading = true;
                if (this.merchant.businessTypeId !== MerchantBusinessType.Manufacturer) {
                    await this.syncCompaniesVrs(selectedCompanies)
                }
                const companiesToSaveFb: Record<string, { id: string, name: string }> = this.mapCompaniesToSaveInFb(this.merchantCompaniesList, selectedCompanies);
                await this.companyService.addMerchantCompanyInFb(this.merchant.id, companiesToSaveFb);
                this.merchantCompaniesList = toCustomArray(companiesToSaveFb);
                const merchantMappedDistributorIds: Array<string> = this.merchantCompaniesList.map((c) => c.id);
                this.companiesMasterList = this.companiesMasterList.filter((c) => !merchantMappedDistributorIds.includes(c.id));
                this.isLoading = false;
                swal("", "selected company Added Successfully.", "success");
                this.closeCompanyPopUp();
            }
        } catch (error) {
            swal("", "Unable to add the Company", "error");

            console.log("Error While Saving Companies :::", error);
        }
    }


    async syncMerchantCompanies() {
        try {
            await this.syncCompaniesVrs(this.merchantCompaniesList, true);

        } catch (error) {
            swal("", "Unable to sync the Companies", "error");


        }
    }


    async syncCompaniesVrs(selectedCompanies: Array<ICompany>, isSync: boolean = false) {
        try {
            const vrsCompaniesList: Array<any> = await this.companyService.getCompaniesFromVrs(this.merchant.vrsMappingInfo);
            const companiesToSaveInVrs: any = this.mapCompaniesToVrs(selectedCompanies, vrsCompaniesList);

            if (companiesToSaveInVrs) {
                const response = await this.companyService.saveCompaniesInVrs(this.merchant.vrsMappingInfo, companiesToSaveInVrs);

                if (isSync && companiesToSaveInVrs != undefined) {
                    swal("", "Successfully Synced.", "success");

                }
            } else if (isSync && companiesToSaveInVrs == undefined) {
                swal("", "No companies found for syncing", "success");

            }


        } catch (error) {

            throw error;
        }
    }


    //#region private methods


    private getPageCount(companies: Array<ICompany>) {

        this.companyCount = companies.length;
        let pageCount = this.companyCount / 10;
        this.totalPages = Number.isInteger(pageCount) ? pageCount : Math.trunc(pageCount + 1);
    }


    private mapCompaniesToVrs(selectedCompaniesList: Array<ICompany>, vrsCompaniesList: Array<{ id: string, name: string }>) {

        const vrsIds: Array<string> = vrsCompaniesList.map((c) => c.id);
        const companiesToSave: Array<{ title: string, company_id: string }> = selectedCompaniesList.filter((c) => !vrsIds.includes(c.id)).map((c) => {

            return {
                title: c.name,
                company_id: c.id
            }
        });

        if (companiesToSave.length === 0) {

            return undefined;
        }

        return {
            data: {
                items: companiesToSave
            }
        }
    }


    private mapCompaniesToSaveInFb(existingCompanies: Array<any>, newCompanies: Array<any>) {

        const companiesToSave = existingCompanies.concat(newCompanies).map((c) => {

            return {
                id: c.id,
                name: c.name
            }
        });

        return toCustomObject(companiesToSave);
    }

    //#endregion



    /// Old Code


    //#region private methods

    private visualButtonBasedOnRole() {

        // Sync - Production support && Business Type Dist && VrsMapping
        this.isSyncBtnVisible = (this.merchant.vrsMappingInfo && this.roleTypeId === RoleType.ProductionSupport && +this.merchant.businessTypeId !== MerchantBusinessType.Manufacturer);




        // Add vrsMappingInfo && 
        this.showAddButton = this.merchant.businessTypeId == MerchantBusinessType.Manufacturer ? true : this.merchant.vrsMappingInfo != undefined && this.roleTypeId != RoleType.ProductionSupport;

    }

}
