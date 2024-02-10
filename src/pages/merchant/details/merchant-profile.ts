import { inject } from "aurelia-framework";
import {
    ApplicationState,
    getAddressString,
    isValidGstNumber,
    MerchantBusinessType,
    RoleType,
    states,
    validateLatAndLong,
    ValuePair
} from "../../../common";
import { Address, Merchant } from "../../../entities";
import { CompanyService, DistributorService, MerchantService } from "../../../services";
import imageCompression from 'browser-image-compression'


@inject(DistributorService, ApplicationState, MerchantService)

export class MerchantProfile {
    merchantAddressString: string;
    merchant: Merchant = new Merchant();
    states: Array<ValuePair> = states;
    merchantNonEdit: Merchant = new Merchant();
    merchantStatus: boolean;
    isLoading: boolean = false;
    merchantAddress: Address = new Address();
    roleTypeId: number;
    showEditButton: boolean = false;
    isShowGoLive: boolean = false;
    selectedImage: any;
    isImageSelected: boolean = false;
    isPreviewImage: boolean = false
    popupLoader: boolean = false;
    digitalOceanImageUrl: string = "";
    inventoryVendorReference: Array<any> = [];
    selectedInventoryVendor: string;


    constructor(private distributorService: DistributorService,
        private appState: ApplicationState,
        private merchantService: MerchantService
    ) { }

    activate(model: Merchant) {
        this.isLoading = true;
        this.roleTypeId = this.appState.crm.roleTypeId || 0;
        this.merchantNonEdit = model;
        console.log("this.merchantNonEdit :----------------->", this.merchantNonEdit)
        Object.assign(this.merchant, model);
        this.visualButtonBasedOnRole();
        this.merchantStatus = this.merchant.isActive;
        this.getMerchantProfile();
        this.merchantAddressString = getAddressString(this.merchant.address);
        this.isLoading = false;
        this.merchantAddress = Object.assign({}, this.merchant.address);

    }
    async getMerchantProfile() {
        return await this.merchantService.getMerchantLogoFromDigitalOcean(this.merchant.id);

    }

    disableLiveCheckbox() {
        const myCheckbox = document.getElementById("myCheckbox") as HTMLInputElement;
        if (typeof myCheckbox !== 'undefined' && myCheckbox !== null) {
            myCheckbox.disabled = true;
            const element = document.getElementById("goLiveText") as HTMLInputElement;
            element.classList.add("goLiveText");
        }
    }

    enableLiveCheckBox() {
        const myCheckbox = document.getElementById("myCheckbox") as HTMLInputElement;
        if (typeof myCheckbox !== 'undefined' && myCheckbox !== null) {
            myCheckbox.disabled = false;
            const element = document.getElementById("goLiveText") as HTMLInputElement;
            element.classList.add("goLiveText");
        }

    }

    async openProfilePopUp() {
        let x = document.getElementById("addAddressPopUp");
        x!.style.display = "block";
        let y = document.getElementById("shadow");
        y!.style.display = "block";

        if (this.merchant.isActive && this.merchant.isLive) {
            this.disableLiveCheckbox();
        }
        else if (!this.merchant.isActive && !this.merchant.isLive) {
            this.disableLiveCheckbox();
        }
        else if (this.merchant.isActive && !this.merchant.isLive) {
            this.enableLiveCheckBox();
        }
        else if (this.merchant.isLive) {
            this.disableLiveCheckbox();
        }
    }

    closeProfilePopUp() {
        this.isImageSelected = false;
        this.isPreviewImage = false;
        this.selectedImage = null;
        this.isLoading = false;
        Object.assign(this.merchant, this.merchantNonEdit);
        Object.assign(this.merchant.address, this.merchantAddress);
        let x = document.getElementById("addAddressPopUp");
        x!.style.display = "none";
        let y = document.getElementById("shadow");
        y!.style.display = "none";
    }


    validateDetails() {
        let status = true;
        let message = "";
        if (!this.merchant.address.state || !this.merchant.address.city || !this.merchant.address.area || !this.merchant.address.street || !this.merchant.address.country || !this.merchant.address.pincode) {
            message = "Merchant Address Details Required";
            status = false;
        } else {
            if (this.merchant.address.latitude && this.merchant.address.latitude && (!validateLatAndLong(this.merchant.address.latitude) || !validateLatAndLong(this.merchant.address.longitude))) {
                message += "Please fill the valid latitude and longitude\r\n";
                status = false;
            }
            if (this.merchant.gstNumber && !isValidGstNumber(this.merchant.gstNumber)) {
                message += "Please enter Valid GST Number\r\n";
                status = false;
            }
        }

        if (!status) {
            let resetMessage: any = {
                title: "Warning",
                text: message,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#13BB6F",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            };
            swal(resetMessage, () => {
                return;
            });
        }
        return status;
    }


    async saveDetails() { // TODO add loader
        try {
            const updateObj: any = this.getUpdateObj();

            if (this.validateDetails()) {
                let resetMessage: any = {
                    title: "Merchant Details Updated",
                    text: "Do you wish to Save Modified changes.Total Merchant related things to be changed.Do you wish to continue..?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#13BB6F",
                    confirmButtonText: "Yes,Proceed.!",
                    closeOnConfirm: true
                };
                swal(resetMessage, async () => {
                    this.popupLoader = true;
                    if (this.selectedImage) {
                        await this.uploadMerchantImageIntoDigitalOcean();
                        this.digitalOceanImageUrl = await this.getMerchantProfile();
                        const redisEntity = this.mapRedisEntity(this.merchant, this.digitalOceanImageUrl);
                        const res = await this.merchantService.updateVendorInRedis(redisEntity);
                    }
                    await this.distributorService.updateDistributorFB(this.merchant.id, updateObj);
                    this.merchantStatus = this.merchant.isActive;
                    Object.assign(this.merchantNonEdit, this.merchant);
                    Object.assign(this.merchantAddress, this.merchant.address);
                    this.merchantAddressString = getAddressString(this.merchant.address);
                    this.popupLoader = false;
                    this.closeProfilePopUp();
                    swal("", "Merchant Details Updated", "success");
                });
            }
        } catch (error) {
            console.log("error while saving merchant Details ::::::: ")
        }
    }

    private mapRedisEntity(merchant, imageUrl) {
        const id = merchant.id;
        const result = {};
        result[id] = {
            imageUrl: imageUrl,
        };
        return result;
    }

    private getUpdateObj() {

        this.merchant.address.cityLowerCase = this.merchant.address.city.toLowerCase() || "";
        if (this.merchant.businessTypeId === 4 && this.selectedInventoryVendor) {
            return {
                isActive: this.merchant.isActive,
                address: this.merchant.address || {},
                gstNumber: this.merchant.gstNumber,
                panNumber: this.merchant.panNumber,
                isLive: this.merchant.isLive || false,
                inventoryVendorReferenceId: this.selectedInventoryVendor["id"],
                inventoryVendorReferenceName: this.selectedInventoryVendor["name"]
            };
        } else {
            return {
                isActive: this.merchant.isActive,
                address: this.merchant.address || {},
                gstNumber: this.merchant.gstNumber,
                panNumber: this.merchant.panNumber,
                isLive: this.merchant.isLive || false
            };
        }

    }

    private visualButtonBasedOnRole() {
        this.showEditButton = this.roleTypeId != RoleType.ProductionSupport;
        this.isShowGoLive = (this.roleTypeId == RoleType.OnBoardingTeam && this.merchant.businessTypeId !== MerchantBusinessType.Manufacturer);
    }


    async uploadMerchantImageIntoDigitalOcean() {
        console.log("uploadMerchantImageIntoDigitalOcean function called")
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            const selectedFile = this.selectedImage[0];
            var imageType = selectedFile.type.split('/')[1];
            let reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            const compressedFile = await imageCompression(selectedFile, options);
            const base64Sting = await imageCompression.getDataUrlFromFile(compressedFile);
            var dataJson = JSON.stringify(base64Sting).split(",")[1];
            let fileNameWithExtension = `${this.merchant.id}.${imageType}`;
            await this.merchantService.uploadLogoInDigitalOcean(fileNameWithExtension, { imageFile: dataJson, merchantId: this.merchant.id });

            return;

        } catch (error) {
            swal("error", "Image not uploaded", "error");
        }
    }
    displayImagePreview(event) {
        this.isImageSelected = true;
        this.isPreviewImage = true;
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const previewImage = document.getElementById("preview") as HTMLImageElement;
            previewImage.src = reader.result as string;
        };
        reader.readAsDataURL(file);

    }


}

