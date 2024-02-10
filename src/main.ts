import { Aurelia } from 'aurelia-framework';
// we want font-awesome to load as soon as possible to show the fa-spinner
import '../styles/styles.css';
import "./_resources/js/functions";
import 'bootstrap';

import { BaseConfig } from "./common";

// comment out if you don't want a Promise polyfill (remove also from webpack.config.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });
declare var ENV: string;
var firebase = require("firebase");

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-validation')
    .feature('_resources')
    .feature('bootstrap-validation')
    // .plugin('aurelia-dialog')
    .developmentLogging();

  if (ENV === 'development') {
    aurelia.use.developmentLogging();
  }
  let firebaseConfig = new BaseConfig().current.firebaseConfig;
  firebase.initializeApp(firebaseConfig);

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker), 
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}