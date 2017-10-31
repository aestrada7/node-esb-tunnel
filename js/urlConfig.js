var URLS = URLS || {};

//Defaults
//AE: removed / at the beginning of each route so it can work on ADP
var LOCAL_REST_BASE = 'oneweb/ajax/aspro/esb-rest-service';
var LOCAL_REST_BAS_BASE = 'oneweb/ajax/aspro/broker';
var LOCAL_STATIC_DATA = 'app/staticData/';
var LOCAL_PROFILE = 'oneweb/idm/v1/profile';
var LOCAL_REST_BASE_MENU = 'oneweb/ajax/aspro/broker/menus';

var currentEnv = getUrlParameter('env');

if(!currentEnv) {
  currentEnv = 'default';
}

URLS.REST_BASE = APP_URL[currentEnv].REST_BASE || LOCAL_REST_BASE;
URLS.REST_BAS_BASE = APP_URL[currentEnv].REST_BAS_BASE || LOCAL_REST_BAS_BASE;
URLS.STATIC_DATA_BASE = APP_URL[currentEnv].STATIC_DATA_BASE || LOCAL_STATIC_DATA;
URLS.PROFILE = APP_URL[currentEnv].PROFILE_ENDPOINT || LOCAL_PROFILE;
URLS.REST_BASE_MENU = APP_URL[currentEnv].REST_BASE_MENU || LOCAL_REST_BASE_MENU;
URLS.usePreloadedStaticData = APP_URL[currentEnv].usePreloadedStaticData === "1";

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}