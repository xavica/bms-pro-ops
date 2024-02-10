export function getAddCompaniesBaseUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/add_company`,
        test: `https://workflow.test.viwito.com/webhook/add_company`,
        staging: `https://workflow.staging.viwito.com/webhook/add_company`,
        production: `https://workflow.viwito.com/webhook/add_company`
    }[env];
}

export function updateCompanyLogoBaseUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/update_company_logo_url`,
        test: `https://workflow.test.viwito.com/webhook/update_company_logo_url`,
        staging: `https://workflow.staging.viwito.com/webhook/update_company_logo_url`,
        production: `https://workflow.viwito.com/webhook/update_company_logo_url`
    }[env];
}

export function getCompanyLogoBaseUrl(env: string) {
    const coreUrls = {
        development: `https://viwito-company-logos-dev.sgp1.digitaloceanspaces.com`,
        test: `https://viwito-company-logos-qa.sgp1.digitaloceanspaces.com`,
        staging: `https://viwito-company-logos-staging.sgp1.digitaloceanspaces.com`,
        production: `https://viwito-company-logos-prod.sgp1.digitaloceanspaces.com`
    }

    return coreUrls[env];

}

export function getCompaniesBaseUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/get_companies`,
        test: `https://workflow.test.viwito.com/webhook/get_companies`,
        staging: `https://workflow.staging.viwito.com/webhook/get_companies`,
        production: `https://workflow.viwito.com/webhook/get_companies`
    }[env];
}

export function uploadCompanyLogoBaseUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        test: `https://workflow.test.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        staging: `https://workflow.staging.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        production: `https://workflow.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`
    }[env];
}

export function getCustomersByVendorGeoAreaUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/09211103-784a-4b32-9e00-2d781fec4fa1`,
        test: `https://workflow.test.viwito.com/webhook/09211103-784a-4b32-9e00-2d781fec4fa1`,
        staging: `https://workflow.staging.viwito.com/webhook/09211103-784a-4b32-9e00-2d781fec4fa1`,
        production: `https://workflow.viwito.com/webhook/09211103-784a-4b32-9e00-2d781fec4fa1`
    }[env];
}

export function getCustomerUploadDocUrl(env: string) {
    return {
        development: `https://workflow.dev.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        test: `https://workflow.test.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        staging: `https://workflow.staging.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        production: `https://workflow.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`
    }[env];
}

export function getCustomerDocImgUrl(env: string) {
    return {
        development: `https://viwito-customer-docs-dev-qa-staging.sgp1.digitaloceanspaces.com`,
        test: `https://viwito-customer-docs-dev-qa-staging.sgp1.digitaloceanspaces.com`,
        staging: `https://viwito-customer-docs-dev-qa-staging.sgp1.digitaloceanspaces.com`,
        production: `https://viwito-customer-docs-prod.sgp1.digitaloceanspaces.com`
    }[env];
}

export function uploadMerchantLogoBaseUrl(env: string) {
    return {

        development: `https://workflow.dev.viwito.com/webhook/d152e4c9-2d4d-4024-8068-a77f2647acfd/images`,
        test: `https://workflow.test.viwito.com/webhook/ea44e6eb-8e6e-4e57-9436-a110072e3f7b/images`,
        staging: `https://workflow.staging.viwito.com/webhook/e80b4fa9-82c5-44b5-8f8b-1039703bcf5f/images`,
        production: `https://workflow.viwito.com/webhook/ea44e6eb-8e6e-4e57-9436-a110072e3f7b/images`
    }[env];
}

export function getMerchantLogoBaseUrl(env: string) {
    const coreUrls = {
        development: `https://viwito-seller-images-dev-test-staging.sgp1.digitaloceanspaces.com`,
        test: `https://viwito-seller-images-dev-test-staging.sgp1.digitaloceanspaces.com`,
        staging: `https://viwito-seller-images-dev-test-staging.sgp1.digitaloceanspaces.com`,
        production: `https://viwito-seller-images-prod.sgp1.digitaloceanspaces.com`
    }

    return coreUrls[env];

}

export function getServiceApiUrl(env: string) {
    return {
        development: `https://dev-qwipo.azurewebsites.net/services/api`,
        test: `https://test-qwipo.azurewebsites.net/services/api`,
        staging: `https://staging-qwipo.azurewebsites.net/services/api`,
        production: `https://qwipo.com/services/api`
    }[env];
}