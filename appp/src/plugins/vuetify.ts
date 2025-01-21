import { createVuetify } from 'vuetify';
import { ru } from 'vuetify/locale';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  components,
  directives,
});

export default vuetify;