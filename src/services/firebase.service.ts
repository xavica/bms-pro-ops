import { inject } from 'aurelia-framework';
import * as firebase from 'firebase';
@inject()
export class FirebaseService {
  db: firebase.database.Database;
  auth: firebase.auth.Auth;
  constructor() {
    this.db = firebase.database();
    this.auth = firebase.auth();

  }
  /**
   * 
   * @param path - DB Node Path
   * @returns 
   */

  async getData(path: string) {
    try {
      const response = await this.db.ref(path).once('value');

      return response && response.val();
    } catch (error) {

      throw error;
    }
  }

  async getDataByFilters(path: string, key: string, value: string | number | boolean) {

    try {
      const response = await this.db.ref(path).orderByChild(key).equalTo(value).once('value');

      return response && response.val();
    } catch (error) {

      throw error;
    }
  }
  async insert(path: string, value: any) {
    try {
      const response = await this.db.ref(path).set(value);

      return response;
    } catch (error) {

      throw error
    }
  }

  async update(path: string, value: any) {
    try {
      const response = await this.db.ref(path).update(value);

      return response;
    } catch (error) {

      throw error
    }
  }

  async delete(path: string) {
    try {
      const response = await this.db.ref(path).set(null);

      return response;
    } catch (error) {

      throw error
    }
  }

  async setAuthTokenToLocalStorage() {
    try {
      const currentUser = this.auth.currentUser;

      if (currentUser != null) {
        const idToken = await this.auth.currentUser!.getToken(true);
        console.log("Firebase Service setAuthTokenToLocalStorage idToken ::: ", idToken);

        if (idToken) {
          window.localStorage.setItem('aurelia_access_token', idToken);
        }
      }
    } catch (error) {
      console.log("Firebase Service setAuthTokenToLocalStorage Error ::: ", error);
    }
  }

  async logout() {

    return this.auth.signOut();
  }


  async checkUserLoggedIn() {

    return this.auth.currentUser
  }

  async signInWithEmailAndPassword(email: string, passWord: string) {

    return this.auth.signInWithEmailAndPassword(email, passWord);
  }




  async createUserWithEmailAndPassword(email: string, passWord: string) {

    return this.auth.createUserWithEmailAndPassword(email, passWord);
  }

}
