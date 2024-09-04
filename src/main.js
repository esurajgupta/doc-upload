import './assets/main.css';
// import './index.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Panel from 'primevue/panel';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import TextArea from 'primevue/textarea';
import Divider from 'primevue/divider';
import Image from 'primevue/image';
import Lara from '@/presets/lara';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import ProgressSpinner from 'primevue/progressspinner';
import Breadcrumbs from 'primevue/breadcrumb';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import OrganizationChart from 'primevue/organizationchart';
const app = createApp(App)

app.use(PrimeVue, {
    ripple: true, unstyled: true, options: {
        cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
        }
    }, pt: Lara
});
app.use(router);
app.use(ToastService);
app.mount('#app');
app.component('AutoComplete', AutoComplete);
app.component('Button', Button);
app.component('FileUpload', FileUpload);
app.component('Panel', Panel);
app.component('InputText', InputText);
app.component('Select', Select);
app.component('TextArea', TextArea);
app.component('Button', Button);
app.component('Divider', Divider);
app.component('Image', Image);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputIcon', InputIcon);
app.component('IconField', IconField);
app.component('Tag', Tag);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Breadcrumbs', Breadcrumbs);
app.component('ThemeSwitcher', ThemeSwitcher);
app.component('OrganizationChart', OrganizationChart);