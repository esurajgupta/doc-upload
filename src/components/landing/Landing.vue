<template>
    <div class="absolute w-full bg-surface-200 min-h-100"></div>
    <div class="fixed grid grid-cols-12 grid-flow-col h-full max-h-screen min-w-full "
        style="background-color: #f3f3f3;">
        <div class="ml-2 mt-2  card inset-y-0 overflow-y-auto transition-transform duration-200 sidebar-menu bg-white rounded shadow-md"
            :class="`${sidebarVisible ? 'col-span-2 ' : 'hidden'}`" style=" transition: 'transform 0.2s ease-in-out' "
            :style="{ transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)' }">
            <SideBar />
        </div>
        <div class=" mt-2 ml-2 transition-all duration-200 ease-in-out rounded-xl sidebar-menu "
            :class="`${sidebarVisible ? 'col-span-10' : 'col-span-12'}`">
            <ThemeSwitcher />
            <div class="row-span-10">
                <Toast />
                <!-- <loading 
                   v-model:active="isLoading"
                   :can-cancel="true"
                   :on-cancel="onCancel"
                   loader="bars"
                   :color="loadingColor"
                   :is-full-page="fullPage"
                   />  -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from "@/components/landing/SideBar.vue";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
    name: 'Landing',
    components: { SideBar, Loading },
    data() {
        return {
            loadingColor: 'var(--vf-primary)',
            isLoading: false,
            fullPage: true,
            sidebarVisible: true
        }
    },
}
</script>

<style scoped>
.sidebar-menu {
    transition: transform 1.5s ease-in-out;
    /* Smooth transition */
}

.hidden {
    display: none;
}
</style>