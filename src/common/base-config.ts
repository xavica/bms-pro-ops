export interface IConfig {
  apiCoreUrl: string;
  itemService: string;
  authHeader: string;
  authToken: string;
  storage: string;
  firebaseConfig: any;
  firebaseServerKey: any;
  mapsApiKey: any;
  containerUrl: any;
  geoUrl: string;
  env: string;
  redisApiUrl: string;
}
declare var ENV: string;
export class BaseConfig {
  _current: IConfig;

  get current(): IConfig {
    return this._current;
  };
  constructor() {
    // let ENV = "development";
   let firebaseConfig = {
    apiKey: "AIzaSyDvil7FitRz5FvCvqV_elC9e9877TtImMU",
    authDomain: "devqwipo.firebaseapp.com",
    databaseURL: "https://devqwipo.firebaseio.com",
    projectId: "devqwipo",
    storageBucket: "devqwipo.appspot.com",
    messagingSenderId: "95302609868",
    appId: "1:95302609868:web:57d524c8593ac77f2ecb69",
    measurementId: "G-2G1N0P1XC9"
  };
    let serveryKey = "AAAAFjB6a8w:APA91bF9gXudBrlnMmotpcB9oUK7ctvQDimWx3JVGuHL8mAaBsASkQExkP9cUNpuR3yo2-PNvmY1pzj8gnBb8nNnda90W22TcIY9voPBfht12UubMU-gey351hXGdbS54Wl3b5hgLJY8Vujv7LIvdCcWuT6SKRAs0Q";
    let mapsApiKey = "AIzaSyDAm9IOMXXFlj_ZBe6bVnlp_ghx2Bpql9g",
      containerUrl = "https://smamidi.blob.core.windows.net/qwipo/",
      coreUrl = "https://api.dev.viwito.com/api",
      geoUrl = "https://geo.dev.viwito.com/api/v1",
      redisUrl = "https://redis.dev.viwito.com",
      itemService = "https://item-service.dev.bms.viwito.com/api/"

    if (ENV === "test") {
      // ENV = "test";
      coreUrl = "https://api.test.viwito.com/api";
      geoUrl = "https://geo.test.viwito.com/api/v1";
      redisUrl = "";
      firebaseConfig = {
        apiKey: "AIzaSyCQxan-AN2bk2GTyav2PfKU2raT_QYlNiA",
        authDomain: "test-qwipo.firebaseapp.com",
        databaseURL: "https://test-qwipo.firebaseio.com",
        projectId: "test-qwipo",
        storageBucket: "test-qwipo.appspot.com",
        messagingSenderId: "1002423689795",
        appId: "1:1002423689795:web:368c953cccebfe247b2af6",
        measurementId: "G-V0VVNGXRZ9"
      };
      serveryKey = 'AAAA6WUbokM:APA91bHgQtcdeEwO9sgWVeazcmNmNkjy1lA3tg16JUhCJjMwR2M4qpLVPR-06P5Eb8ROKBVEfHY8DMhc5Zz9_shDlq3uWdRtsS-9kPSalbLEnaWQg0-D_hTgRgEk316JlKeo7DWdMvqkakGdP84qJnPftdkmK8bwlA';
      mapsApiKey = 'AIzaSyCu9wJCbsPQunR3bqsB063ET8_r719Uo60',
        containerUrl = "https://smamidi.blob.core.windows.net/qwipo/",
        itemService = "https://item-service.test.bms.viwito.com/api/"

    }
    else if (ENV === "staging") {
      // ENV = "staging";
      coreUrl = "https://api.staging.viwito.com/api";
      geoUrl = "https://geo.staging.viwito.com/api/v1";
      redisUrl = "";
      firebaseConfig = {
        apiKey: "AIzaSyDDMgqsy8EwbRHE7mRzO6jvZX0hwNXGJcs",
        authDomain: "staging-qwipo-2015.firebaseapp.com",
        databaseURL: "https://staging-qwipo-2015-default-rtdb.firebaseio.com",
        projectId: "staging-qwipo-2015",
        storageBucket: "staging-qwipo-2015.appspot.com",
        messagingSenderId: "1016985034148",
        appId: "1:1016985034148:web:8a64c128f2aaa815c47531",
        measurementId: "G-RKTLZXSC6K"
      };
      serveryKey = 'AAAA7MkIHaQ:APA91bHIaSoAXUmfMxSj_DcYcJQl9pr_2GZavOXz9dfuasBieo1SR2cEgWoKhpbSiYQe6wDBfyaKQCiaR8pZpo1zsVLoi57fOdgZSvDuB7sUpFu_E3yYHsb7BKDig0HgT3y7cAtyDc0n'
      mapsApiKey = 'AIzaSyCu9wJCbsPQunR3bqsB063ET8_r719Uo60',
        containerUrl = "https://smamidi.blob.core.windows.net/qwipo/",
        itemService = "https://item-service.staging.bms.viwito.com/api/"
    }
    else if (ENV === "production") {
      // ENV = "production";
      coreUrl = "https://api.viwito.com/api";
      geoUrl = "https://geo.viwito.com/api/v1";
      redisUrl = "";
      firebaseConfig = {
        apiKey: "AIzaSyDbV-CkDA4kFmMdmjgl_MSWIfqUh9YNSpE",
        authDomain: "qwipo-82b7a.firebaseapp.com",
        databaseURL: "https://qwipo-82b7a.firebaseio.com",
        projectId: "qwipo-82b7a",
        storageBucket: "qwipo-82b7a.appspot.com",
        messagingSenderId: "719176192291",
        appId: "1:719176192291:web:0bd89bef14d848cc2a3c96",
        measurementId: "G-BGYZX6JL0R"
      };

      //must change based on production environment
      serveryKey = 'AAAAp3I90SM:APA91bHvVfy5SObF4uT-GwCXTrCZn4rRjjBVln8LKS70nZ4520BvYp-wwp0n13e-8CGtvCV1zBqhj6Xcp4vFNWl8nGUoQMYeJAlGRzSRYTmBHRV2Y-FtnnKzXMKA27MtS6ytfWVy4p9M';
      mapsApiKey = 'AIzaSyDbV-CkDA4kFmMdmjgl_MSWIfqUh9YNSpE';
      containerUrl = "https://xavica.blob.core.windows.net/qwipo/",
      itemService = ""

    }
    this._current = {
      firebaseConfig: firebaseConfig,
      apiCoreUrl: coreUrl,
      authHeader: 'Authorization',
      authToken: 'Bearer',
      storage: 'localStorage',
      firebaseServerKey: serveryKey,
      mapsApiKey: mapsApiKey,
      containerUrl: containerUrl,
      geoUrl: geoUrl,
      env: ENV,
      redisApiUrl: redisUrl,
      itemService: itemService
    };
  }
}
