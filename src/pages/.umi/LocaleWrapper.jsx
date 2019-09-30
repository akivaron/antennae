
import { _setIntlObject, addLocaleData, IntlProvider, intlShape } from 'umi-plugin-locale';

const InjectedWrapper = (() => {
  let sfc = (props, context) => {
    _setIntlObject(context.intl);
    return props.children;
  };
  sfc.contextTypes = {
    intl: intlShape,
  };
  return sfc;
})();

import 'moment/locale/id';
import 'moment/locale/zh-cn';

const baseNavigator = true;
const useLocalStorage = true;

import { LocaleProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/id';
let defaultAntd = require('antd/lib/locale-provider/id_ID');
defaultAntd = defaultAntd.default || defaultAntd;

const localeInfo = {
  'en-US': {
    messages: {
      ...require('C:/xampp/htdocs/skripsi_frontend/src/locales/en-US.js').default,
    },
    locale: 'en-US',
    antd: require('antd/lib/locale-provider/en_US'),
    data: require('react-intl/locale-data/en'),
    momentLocale: '',
  },
  'id-ID': {
    messages: {
      ...require('C:/xampp/htdocs/skripsi_frontend/src/locales/id-ID.js').default,
    },
    locale: 'id-ID',
    antd: require('antd/lib/locale-provider/id_ID'),
    data: require('react-intl/locale-data/id'),
    momentLocale: 'id',
  },
  'zh-CN': {
    messages: {
      ...require('C:/xampp/htdocs/skripsi_frontend/src/locales/zh-CN.js').default,
    },
    locale: 'zh-CN',
    antd: require('antd/lib/locale-provider/zh_CN'),
    data: require('react-intl/locale-data/zh'),
    momentLocale: 'zh-cn',
  },
};

let appLocale = {
  locale: 'id-ID',
  messages: {},
  data: require('react-intl/locale-data/id'),
  momentLocale: 'id',
};
if (useLocalStorage && localStorage.getItem('umi_locale') && localeInfo[localStorage.getItem('umi_locale')]) {
  appLocale = localeInfo[localStorage.getItem('umi_locale')];
} else if (localeInfo[navigator.language] && baseNavigator){
  appLocale = localeInfo[navigator.language];
} else {
  appLocale = localeInfo['id-ID'] || appLocale;
}
window.g_lang = appLocale.locale;
appLocale.data && addLocaleData(appLocale.data);

export default function LocaleWrapper(props) {
  let ret = props.children;
  ret = (<IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
    <InjectedWrapper>{ret}</InjectedWrapper>
  </IntlProvider>)
  ret = (<LocaleProvider locale={appLocale.antd ? (appLocale.antd.default || appLocale.antd) : defaultAntd}>
    {ret}
  </LocaleProvider>);
  return ret;
}
