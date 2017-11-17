var URLS = URLS || {};

//Defaults
//AE: removed / at the beginning of each route so it can work on ADP
var DEFAULT_REST_BASE = 'oneweb/ajax/aspro/esb-rest-service';
var DEFAULT_REST_BAS_BASE = 'oneweb/ajax/aspro/broker';
var DEFAULT_STATIC_DATA = 'app/staticData/';
var DEFAULT_PROFILE = 'oneweb/idm/v1/profile';
var DEFAULT_REST_BASE_MENU = 'oneweb/ajax/aspro/broker/menus';

URLS.REST_BASE = DEFAULT_REST_BASE;
URLS.REST_BAS_BASE = DEFAULT_REST_BAS_BASE;
URLS.STATIC_DATA_BASE = DEFAULT_STATIC_DATA;
URLS.PROFILE = DEFAULT_PROFILE;
URLS.REST_BASE_MENU = DEFAULT_REST_BASE_MENU;
URLS.usePreloadedStaticData = false;

var currentEnv = getUrlParameter('env');

if(!currentEnv) {
  currentEnv = 'default';
}

if(APP_URL[currentEnv]) {
  if(APP_URL[currentEnv].REST_BASE) {
    URLS.REST_BASE = APP_URL[currentEnv].REST_BASE;
  }

  if(APP_URL[currentEnv].REST_BAS_BASE) {
    URLS.REST_BAS_BASE = APP_URL[currentEnv].REST_BAS_BASE;
  }

  if(APP_URL[currentEnv].STATIC_DATA_BASE) {
    URLS.STATIC_DATA_BASE = APP_URL[currentEnv].STATIC_DATA_BASE;
  }

  if(APP_URL[currentEnv].PROFILE_ENDPOINT) {
    URLS.PROFILE = APP_URL[currentEnv].PROFILE_ENDPOINT;
  }

  if(APP_URL[currentEnv].REST_BASE_MENU) {
    URLS.REST_BASE_MENU = APP_URL[currentEnv].REST_BASE_MENU;
  }

  URLS.usePreloadedStaticData = APP_URL[currentEnv].usePreloadedStaticData === "1";
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}