import { Customer } from './../../../entities/customer';
import { CustomerService } from './../../../services/customer.service';
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Address, Merchant } from "../../../entities";
import { getFormattedDate, isEmptyValue, isValidBusinessName, isValidEmail, isValidMobileNumber, isValidName, isValidPincode, uuidv4 } from '../../../common/utility';
import { VrsMerchantAPIKeys } from '../../../entities/vrs-merchant-keys';
import { CustomerExcelImport } from '../../../entities/customer';
import * as XLSX from 'xlsx';
import { BusinessType, CustomerRegistrationSource, UserType } from '../../../common';
import { UserService } from '../../../services';
@inject(Router, CustomerService, UserService)
export class CustomerUpload {
    merchant: Merchant = new Merchant();
    vrsMerchantAPIKeys: VrsMerchantAPIKeys;
    selectedfile: Array<any> = [];
    isLoader: boolean = false;
    excelCustomers: Array<CustomerExcelImport> = [];
    customers: Array<Customer> = [];
    duplicateCustomersFromExcel: Array<CustomerExcelImport> = [];
    searchedCustomers: Array<Customer> = [];
    importExcelOption: boolean = false;
    errorMessage: string = "";
    customerRowsWithError: Array<any> = [];
    isLoading: boolean = false;
    noOfSavedRecords: number=0;
    unregisteredCustomerEntities: Array<any> = [];
    unregisteredCustomers: Array<CustomerExcelImport> = [];
    registeredCustomers: Array<CustomerExcelImport> = [];
    excelFileFormat: string = '';
    customersFromExcel: number;
    constructor(private router: Router, private customerService: CustomerService, private userService: UserService) {

    }
    activate(model: Merchant) {
        Object.assign(this.merchant, model);
        this.vrsMerchantAPIKeys = this.merchant.vrsMappingInfo;
        this.isLoader = false;
    }

    //#region public

    async convertexcel() {
        this.isLoading = true;
        if (!(this.selectedfile && this.selectedfile.length > 0)) {
            swal("Please Upload Excel File.", "", "error");
            return;
        }
        this.customerRowsWithError = [];
        this.excelCustomers = [];
        this.unregisteredCustomerEntities = [];
        this.errorMessage = "";
        const file = this.selectedfile[0];
        const reader: FileReader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e: any) => {
            const binarystr = new Uint8Array(e.target.result);
            const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'array', raw: true, cellFormula: false });
            const wsname = wb.SheetNames[0];
            const modelMetadata: Array<string> = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
            this.excelCustomers = modelMetadata.map(row => {
                return {
                    name: row['Name'],
                    businessName: row['Business Name'],
                    mobileNumber: isEmptyValue(row['Mobile Number']) ? '' : row['Mobile Number'].toString(),
                    email: isEmptyValue(row['Email']) ? '' : row['Email'],
                    gstNumber: isEmptyValue(row['Gst Number']) ? '' : row['Gst Number'],
                    beatName: isEmptyValue(row['Beat Name']) ? '' : row['Beat Name'],
                    street: isEmptyValue(row['Street']) ? 'Un_Known_Street' : row['Street'],
                    area: isEmptyValue(row['Area']) ? 'Un_Known_Area' : row['Area'],
                    city: isEmptyValue(row['City']) ? 'Un_Known_City' : row['City'],
                    state: isEmptyValue(row['State']) ? 'Un_Known_State' : row['State'],
                    pincode: isEmptyValue(row['Pin Code']) ? '' : row['Pin Code'],
                    latitude: isEmptyValue(row['Latitude']) ? '' : row['Latitude'],
                    longitude: isEmptyValue(row['Longitude']) ? '' : row['Longitude'],
                }
            });
            if (this.excelCustomers.length <= 0) {
                swal("Excel should not be empty", "", "error");
                return;
            }
            if (!this.validateColumns(this.excelCustomers)) {
                swal(this.errorMessage, "", "error");
                return;
            }
            //  validate the customer mobile numbers - must be numbers
            const customersMobileNumber = this.excelCustomers.map(customer => ((customer.mobileNumber).toString().trim()).toLowerCase());
            const duplicateCustomer = this.findDuplicateCustomerInExcel(customersMobileNumber);
            this.customerRowsWithError = this.excelCustomers.filter(customer => duplicateCustomer.includes(((customer.mobileNumber).toString()).toLowerCase())) || [];

            if (duplicateCustomer.length > 0) {
                swal("Please remove the duplicate mobile numbers.", "", "error");
                this.errorMessage = "Please remove the following duplicate entries from Excel:";
                console.log("duplicateCustomer",duplicateCustomer);
                return;
            }
            // validate duplicate email Ids
            const customersEmailIds = this.excelCustomers.filter((c) => c.email.length > 0).map(customer => ((customer.email).toString().trim()).toLowerCase());
            const duplicateEmails = this.findDuplicateCustomerInExcel(customersEmailIds);
            this.customerRowsWithError = this.excelCustomers.filter(customer => duplicateEmails.includes(((customer.email).toString()).toLowerCase())) || [];
            if (duplicateEmails.length > 0) {
                swal("Please remove the duplicate emails.", "", "error");
                this.errorMessage = "Please remove the following duplicate emails from Excel:";

                return;
            }

            const registeredCustomersWithEmailIds = await this.customerService.getCustomersByEmailIdsDB(customersEmailIds);
            if (registeredCustomersWithEmailIds.length > 0) {
                let registeredCustomersEmailIds = registeredCustomersWithEmailIds.map(customer => (customer.email.trim()).toLowerCase());
                swal("Following email's /s are already registered. Please remove them : " + registeredCustomersEmailIds.join(", "), "", "error");
                this.customerRowsWithError = this.excelCustomers.filter(customer => registeredCustomersEmailIds.includes(((customer.email).toString()).toLowerCase())) || [];
                this.errorMessage = "Following email's /s are already registered. Please remove these.";

                return;
            }


            //const unregisteredCustomersMobileNumber: Array<any> = [];
            let registeredCustomersMobileNumber: Array<any> = [];
            let registeredCustomerEntities: Array<any> = [];

            //console.log('customersMobileNumber ::: ', customersMobileNumber);
            this.customersFromExcel = customersMobileNumber.length;
            const registeredCustomers = await this.customerService.getCustomersByMobileNumbersDB(customersMobileNumber);
            //console.log("registeredCustomers from DB:- ",registeredCustomers);
            registeredCustomersMobileNumber = registeredCustomers.map(customer => ((customer.mobileNumber).toString().trim()).toLowerCase()); 
            const unregisteredCustomersMobileNumber = customersMobileNumber.filter(customerMobileNumber => !(registeredCustomersMobileNumber.includes((customerMobileNumber).toString()))) || [];
            
            // console.log("registeredCustomers:- ",registeredCustomersMobileNumber);
            // console.log("unregisteredCustomersMobileNumber:- ",unregisteredCustomersMobileNumber);
         
            for (const registeredCustomer of registeredCustomers) {
                const searchResult: Array<any> = await this.customerService.customerSearchFB('mobileNumber', registeredCustomer.mobileNumber);
                if (searchResult.length > 0) {
                    registeredCustomerEntities.push(searchResult[0]);
                }
            }
            this.unregisteredCustomers = this.excelCustomers.filter(customer => unregisteredCustomersMobileNumber.includes(((customer.mobileNumber).toString()).toLowerCase())) || [];
            this.registeredCustomers = this.excelCustomers.filter(customer => registeredCustomersMobileNumber.includes(((customer.mobileNumber).toString()).toLowerCase())) || [];
            console.log("unregisteredCustomers :- ", this.unregisteredCustomers);
            console.log("registeredCustomers :- ", this.registeredCustomers);
            
            this.unregisteredCustomerEntities = this.getCustomerDataNeededSaved(this.unregisteredCustomers);
            await this.saveExcelCustomersInFirebase();

            const allCustomers: Array<any> = [].concat.apply(registeredCustomerEntities, this.unregisteredCustomerEntities);
            await this.createCustomersInVrs(allCustomers);
            this.excelCustomers = [];
        }

    }

   
    backButton() {
        this.router.navigateBack();
    }
    private validateColumns(customerList: Array<any>) {
        this.errorMessage = "";
        this.customerRowsWithError = [];
        for (const customer of customerList) {
            if (
                isEmptyValue(customer.name) ||
                isEmptyValue(customer.businessName) ||
                isEmptyValue(customer.mobileNumber) ||
                isEmptyValue(customer.city) ||
                isEmptyValue(customer.state) ||
                // isEmptyValue(customer.pincode) ||
                isEmptyValue(customer.street)
            ) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Fields should not be empty! \n for customer ${customer.name}`;
                console.log("Fields should not be empty:- ", customer);
                return false;
            }
            if (!isValidName(customer.name)) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid Name! \n for customer ${customer.name}`;
                console.log("Invalid Name:- ", customer.name);
                return false;
            }
            // if (!isValidBusinessName(customer.businessName)) {
            //     this.customerRowsWithError.push(customer);
            //     this.errorMessage = "Invalid Business Name! \n";
            //     console.log("Invalid Name:- ", customer.businessName);
            //     return false;
            // }
            if (!isValidMobileNumber(customer.mobileNumber)) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid Mobile Number! \n for customer ${customer.name}`;

                return false;
            }
            // if (customer.email && !isValidEmail(customer.email)) {
            //     this.customerRowsWithError.push(customer);
            //     this.errorMessage = `Invalid Email! \n for customer ${customer.name}`;

            //     return false;
            // }
            if (!isEmptyValue(customer.city) && !isValidName(customer.city)) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid City Name! \n for customer ${customer.name}`;

                return false;
            }
            if (!isEmptyValue(customer.state) && !isValidName(customer.state)) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid State Name! \n for customer ${customer.name}`;

                return false;
            }
            if (customer.pincode && !isValidPincode(customer.pincode)) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid Pin Code! \n for customer ${customer.name}`;

                return false;
            }
            if (customer.street && customer.street.length > 100) {
                this.customerRowsWithError.push(customer);
                this.errorMessage = `Invalid Street Name! \n for customer ${customer.name}`;

                return false;
            }

        }
        return true;
    }
    private findDuplicateCustomerInExcel(itemList: Array<string>) {
        const inputList = new Set<String>();
        const duplicates = new Set<String>();
        for (const item of itemList) {
            if (inputList.has(item)) {
                duplicates.add(item)
            } else {
                inputList.add(item)
            }
        }
        return Array.from(duplicates);
    }
    private mapToAuthId(emailId: string, mobileNumber: string) {

        return emailId.length > 0 ? emailId.toLowerCase() : `${mobileNumber}@auth.com`;
    }
    private getCustomerDataNeededSaved(customersToBeSaved: Array<CustomerExcelImport>) {
        return customersToBeSaved.map((customer) => {
            const address: Address = {
                street: customer.street || "",
                area: customer.area || "",
                state: customer.state || "",// TODO need to check may be we need to give drop down
                country: "INDIA",
                pincode: customer.pincode || "",
                city: customer.city || "",
                cityLowerCase: customer.city.toLowerCase() || "",
                latitude: customer.latitude,
                longitude: customer.longitude
            }
            return {
                id: uuidv4(),
                name: customer.name || "",
                nameLowerCase: customer.name.toLowerCase(),
                businessName: customer.businessName || "",
                mobileNumber: customer.mobileNumber,
                email: customer.email || "",
                emailLowerCase: customer.email.toLowerCase() || "",
                authId: this.mapToAuthId(customer.email.toLowerCase(), customer.mobileNumber),
                email_mobileNumber: `${customer.email.toLowerCase()}_${customer.mobileNumber.toString().toLowerCase()}`,
                gstNumber: customer.gstNumber || "UNREGISTERED",
                address: address,
                maxDueAmount: 1500000,
                businessTagStatus: 'Active-User',
                businessType: "Kirana",
                businessTypeId: BusinessType.Kirana,
                createdDate: new Date().getTime(),
                dueAmount: 0,
                isActive: true,
                profilePicStorageName: '',
                profilePicUrl: '',
                representativeMobileNumber: '',
                representativeName: '',
                source: CustomerRegistrationSource.BulkImport,// B2B ? 0 : 1
                token: '',
                userTypeId: UserType.Customer,
                alternativeMobileNumber: '',
                gstCertificateUrl: '',
                shopUrl: '',
                registrationDocumentUrl: '',
                photoIdUrl: '',
                isRegistered: false
            };
        })
    }

    private wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
    private mapToCustomerPassword(authId: string = '', mobileNumber: string = '') {
        return `@${authId.slice(0, 4)}*${mobileNumber.slice(-5)}`;
    }
    async saveExcelCustomersInFirebase() {
        console.log("Saving In Firebase.....");
        try {
            this.isLoading = true;
            // saved customer data in excel
            for (const customer of this.unregisteredCustomerEntities) {
                try{
                const customerPassWord: string = this.mapToCustomerPassword(customer.authId, customer.mobileNumber);
                const customerAuthResponse = await this.userService.createUserWithEmailAndPassword(customer.authId, customerPassWord);
                customer.id = customerAuthResponse && customerAuthResponse.uid;

                await this.customerService.addCustomerFB(customer.id, customer);
                }
                catch(error) {
                    console.log("Error In firebase Insert Customers",customer,"Error:-",error);
                }
                
                this.noOfSavedRecords++;
                await this.wait(1000);
            }
            this.isLoading = false;
            this.noOfSavedRecords = 0;
            // this.excelCustomers = []; TODO
        } catch(error) {
            swal("Something went wrong. Please try again later.","","error");
            this.isLoading = false;
        }

    }
    async createCustomersInVrs(customers: Array<any>) {
        console.log('Saving In VRS .....');
        const vrsCustomers: Array<any> = await this.customerService.getAllCustomersFromErp(this.vrsMerchantAPIKeys);

        const vrsCustomersMobileNumber = vrsCustomers.map((vc) => vc.mobile_number && vc.mobile_number.toString())

        const vrsUnregisteredCustomers = customers.filter((c) => !vrsCustomersMobileNumber.includes(c.mobileNumber));

        // TODO need to refactor;

        let isError = false;
        for (const customer of vrsUnregisteredCustomers) {

            try {
                //console.log('excelCustomers ::: ', this.excelCustomers);
                const excelCustomer: any = this.excelCustomers.filter((ec) => ec.mobileNumber === customer.mobileNumber)[0];
                //console.log('excelCustomer ::: ', excelCustomer);
                const clientBeatName: string = excelCustomer.beatName || '-Unassigned';
                const customerToCreate = this.mapToVrsCustomer(customer, clientBeatName);
                const erpCustomerNewlyCreated = await this.customerService.createCustomerInErp(this.vrsMerchantAPIKeys, customerToCreate);
                //console.log("erpCustomerNewlyCreated:- ", "entity:- ", customer, "result:- ", erpCustomerNewlyCreated);

            } catch (error) {
                isError = true;
                console.log("customer-upload createCustomersInVrs error :- ", error);
            }
        };

        if (isError) {
            swal("Few customers are not registered!.", "", "warning");
        } else {
            swal("Customers Saved Successfully!.", "", "success");
        }

    }
    private mapToVrsCustomer(customer: any, clientBeatName: string = '-Unassigned') {

        return {
            customer_name: customer.name,
            customer_group: 'Kirana',
            customer_territory: customer.address.area || 'Un_Known_Area',
            customer_id: customer.id,
            city: customer.city || 'Un_Known_City',
            street: customer.street || 'Un_Known_Street',
            country: 'INDIA',
            data: [{
                user_type_id: 1,
                photo_id_url: '',
                mobile_no: customer.mobileNumber,
                business_name: customer.businessName,
                clientbeatname: clientBeatName,
                is_active: true,
                emial_id: customer.email,
                area: customer.area,
                area_code: customer.area || 'Un_Known_Area',
                pin_code: customer.pincode || '',
                latitude: customer.latitude,
                id: customer.address.area || 'Un_Known_Area',
                state: customer.address.state || 'Un_Known_State',
                longitude: customer.longitude,
                gst_certificate_url: '',
                business_type_id: 2,
                gst_number: '',
                business_type: 'Kirana',
                business_tag_status: '',
                representative_name: '',
                alternative_mobile_number: '',
                is_must_pay: false,
                representative_mobile_number: '',
            }],
            array_config: []
        }
    }
    async getAllCustomers() {
        try {
            const response: Array<any> = await this.customerService.getAllCustomersFromErp(this.vrsMerchantAPIKeys);

            return response.map((c) => {
                return {
                    "Customer Id": c.internal_customer_id,
                    "Business Name": c.customer_name,
                    "Customer Name": c.contact_name || "",
                    "Mobile Number": c.mobile_number,
                    "Beat Name": c.clientbeatname || '',
                    "Business Type": c.business_type,
                    "Gst Category": c.gst_category,
                    "Vrs Id": c.name || ""
                }
            })
        } catch (error) {

            return [];
        }
    }
    async exportToExcel() {
        let vrsCustomers = await this.getAllCustomers();
        if (vrsCustomers && vrsCustomers.length > 0) {
            let sheetName = `VRSCustomers${getFormattedDate()}`;
            var workBook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.json_to_sheet(vrsCustomers);
            XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);
            var outputFileName = `${sheetName}.xlsx`;
            XLSX.writeFile(workBook, outputFileName);
        } else {
            swal("", "Customer data not found!", "warning");
        }


    }
    downloadSampleCustomerUploadFile() {
        let sheetName = `CustomerUploadSample`;
        var workBook = XLSX.utils.book_new();
        const sampleData = this.getSampleData();
        var worksheet = XLSX.utils.json_to_sheet(sampleData);
        XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);

        var outputFileName = `${sheetName}.xlsx`;
        XLSX.writeFile(workBook, outputFileName);
    }

    private getSampleData() {
        return [
            {
                'Name': "Customer Contact Name",
                'Business Name': "Customer Business Name",
                'Mobile Number': "9876543234",
                'Email': "samplemail@gmail.com",
                'Gst Number': "GST567543234567",
                'Beat Name': "Sample Beat Name",
                'Street': "233/ 34 Customer street",
                'Area': "Sample KPHB",
                'City': "Hyderabad",
                'State': "Telangana",
                'Pin Code': "",
                'Latitude': "17.70854568",
                'Longitude': "78.20580292",

            }
        ]
    }
}