import {FirebaseService} from './firebase.service';
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'isomorphic-fetch';
import {BaseConfig, IConfig} from '../common';
// import { extend } from 'lodash';

@inject(HttpClient, BaseConfig, FirebaseService)
export class DataService {
    config : IConfig;
    _contentType : string;
    http : HttpClient;
    defaults = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    configRequest : any;
    _isPlainRequest : boolean;


    constructor(http : HttpClient, baseConfig : BaseConfig, protected firebaseService : FirebaseService) {

        this.configRequest = undefined;
        this.config = baseConfig.current;
        this.config.env = this.config.env == 'int' ? 'development' : this.config.env;
        this.http = http;
        this.http.configure(config => {
            config.useStandardConfiguration().withDefaults({headers: this.defaults.headers})

        });
    }

    async get(route : string, data = undefined, headers = undefined, overideRoute = false, isAuth = true) {

        return this.request(route, 'GET', data, headers, overideRoute, 1, isAuth);
    }

    async post(route : string, data = undefined, headers = undefined, overideRoute = false, isAuth = true) {

        return this.request(route, 'POST', data, headers, overideRoute, 1, isAuth);
    }

    async patch(route : string, data = undefined, headers = undefined, isAuth = true) {

        return this.request(route, 'PATCH', data, headers, false, 1, isAuth);
    }

    async put(route : string, data = undefined, headers = undefined, isAuth = true) {

        return this.request(route, 'PUT', data, headers, false, 1, isAuth);
    }

    async destroy(route : string, data = undefined, headers = undefined, isAuth = true) {

        return this.request(route, 'DELETE', data, headers, false, 1, isAuth);
    }

    async plainRequest(route : string, httpRequestType : string, data = undefined, headers = undefined) {
        this._isPlainRequest = true;

        return this.request(route, httpRequestType, data, headers);
    }


    private async handelResponse(response : Response) {
        try {
            const res = await response.json();

            return res;
        } catch (error) {

            return null;
        }
    }


    async request(route : string, requestType : string, data : any = null, headers : any = undefined, overideRoute = false, reTryCount : number = 1, isAuth : boolean = true) {

        const fullUrl: string = this.route(route, overideRoute);
        const requestOptions = this.requestOptions(headers, requestType, data, isAuth);

        try {

            const response = await this.http.fetch(fullUrl, requestOptions);
            const responseHandle = this.handleErrors(response);
            const res = this.handelResponse(responseHandle);

            return res;
        } catch (error) {
            if (error.status == 401 && reTryCount < 5) {
                await this.firebaseService.setAuthTokenToLocalStorage();

                return this.request(route, requestType, data, headers, overideRoute, (reTryCount + 1));
            }

            throw error;
        }
    }


    // #region Private Methods

    private route(route : string, overideRoute : boolean = false) {

        return(route.indexOf("http") != -1 || overideRoute) ? route : `${
            this.config.apiCoreUrl
        }/${route}`;
    }

    private requestOptions(headers : any = undefined, method : string, data : any, isAuth : boolean = true) {
        const requestOptions = {
            method: method,
            headers: this.defaults.headers,
            body: (data == null) ? data : json(data)
        }
        if (isAuth) {
            requestOptions.headers['Authorization'] = `Bearer ${
                window.localStorage.getItem('aurelia_access_token')
            }`;
        }

        if (headers) {
            requestOptions.headers = headers;
        }

        return requestOptions;
    }


    private handleErrors(response : Response) {
        if (response && !response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }


}
