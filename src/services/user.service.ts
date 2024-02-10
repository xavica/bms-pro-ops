import { FirebaseService } from './firebase.service';
import { inject } from 'aurelia-framework';
import { DB_PATH } from '../constants';
@inject(FirebaseService)
export class UserService {
  constructor(private firebaseService: FirebaseService) {
  }

  async getUser(uid: string) {

    return this.firebaseService.getData(`${DB_PATH.CRM}/${uid}`);
  }

  async logout(): Promise<any> {

    return this.firebaseService.logout()
  }
  checkUserLoggedIn(): Promise<any> {

    return this.firebaseService.checkUserLoggedIn();
  }
  
  async createUserWithEmailAndPassword(email: string, passWord: string) {

    return this.firebaseService.createUserWithEmailAndPassword(email, passWord);
  }
}
