<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between px-4 pt-4 shrink-0">
            <img src="/src/assets/TA-DocuFlowLogo.jpg" class="w-10 h-10 rounded-full">
            <span class="inline-flex items-center gap-2 justify-center w-full py-3">
                <span class="font-semibold text-2xl text-blue-900" style="font-size: 1.3rem; letter-spacing: -0.5px">TA
                    - Docuflow</span>
            </span>
        </div>
        <hr class="mt-2 mb-1" />
        <div v-if="menus != null" class="grow">
            <ul class="list-none px-4 m-0">
                <li v-for="menu of menus">
                    <router-link v-if="menu.menuUrl !== null" :to="menu.menuUrl" v-ripple v-styleclass="{
                        selector: '@next',
                        enterClass: 'hidden',
                        enterActiveClass: 'slidedown',
                        leaveToClass: 'hidden',
                        leaveActiveClass: 'slideup',
                    }" @click="handleMenuClick(menu)"
                        class="p-3 flex items-center text-surface-600 dark:text-surface-500 cursor-pointer rounded-md">
                        <template v-if="menu.menuIcon">
                            <div class="mr-3 text-blue-900" v-if="menu.menuIcon">
                                <i :class="menu.menuIcon"></i>
                            </div>
                        </template>
                        <span class="font-medium text-blue-900">{{ menu.menuName }}</span>
                    </router-link>
                    <div v-if="menu.menuUrl === null" v-ripple @click="handleMenuClick(menu)" v-styleclass="{
                        selector: '@next',
                        enterClass: 'hidden',
                        enterActiveClass: 'slidedown',
                        leaveToClass: 'hidden',
                        leaveActiveClass: 'slideup',
                    }"
                        class="p-3 flex items-center justify-between text-surface-600 dark:text-surface-400 cursor-pointer rounded-md">
                        <template v-if="menu.menuIcon">
                            <div class="mr-3">
                                <i :class="menu.menuIcon"></i>
                            </div>
                        </template>
                        <span class="font-medium">{{ menu.menuName }}</span>
                        <i class="pi pi-chevron-down ml-auto"></i>
                    </div>
                    <ul v-if="menu.children.length !== 0"
                        class="ml-4 list-none p-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                        <li v-for="child of menu.children">
                            <router-link :to="child.menuUrl === null ? '' : child.menuUrl" v-ripple
                                @click="handleMenuClick(child)"
                                class="flex items-center cursor-pointer p-3 rounded-md text-surface-700 dark:text-surface-0/80 hover:bg-primary-200 dark:hover:bg-primary-700 duration-200 transition-colors">
                                <template v-if="menu.menuIcon">
                                    <div class="mr-3">
                                        <i :class="menu.menuIcon"></i>
                                    </div>
                                </template>
                                <span class="font-medium">{{ child.menuName }}</span>
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import MenuIcon from "@/components/MenuIcon.vue";
import { constant } from "@/constants/constants";
export default {
    name: "SideBar",
    components: { MenuIcon },
    data() {
        return {
            icon1FillColor: '#9C9C9C',
            icon2FillColor: 'var(--primary-500)',
            menus: [],
            menusLists: null,
        };
    },
    created() {
        this.generateColor();
        this.menuListItem();
    },
    mounted() {
        this.menus = this.menus.map((item) => { return { ...item, isActive: this.$route.path === item.menuUrl ? true : false } })
    },
    methods: {
        menuListItem() {
            const menuList = [
                { "menuUrl": "/translanding/workflowList", "menuIcon": "pi pi-sitemap", "menuName": "Workflow", "parentmenuid": null, "isActive": false, "children": [] },

                { "menuUrl": "/translanding/InstanceHistory", "menuIcon": "pi pi-clone", "menuName": "Instance History", "parentmenuid": null, "isActive": false, "children": [] }

                // { "menuUrl": "/translanding/user", "menuIcon": "user", "menuName": "User", "parentmenuid": null, "isActive": false, "children": [] },




            ]
            if (localStorage.getItem("role") === constant.adminUserName) {
                // menuList.push(
                //     { "menuUrl": "/translanding/taskList", "menuIcon": "pi pi-clipboard", "menuName": "Tasks", "parentmenuid": null, "isActive": false, "children": [] }
                //     );
                // menuList.push(
                //     { "menuUrl": "/translanding/myFiles", "menuIcon": "pi pi-folder-open", "menuName": "My Files", "parentmenuid": null, "isActive": false, "children": [] }
                // );


            };
            if (localStorage.getItem("role") !== constant.adminUserName) {
                menuList.push(
                    { "menuUrl": "/translanding/myFiles", "menuIcon": "pi pi-folder-open", "menuName": "Document List", "parentmenuid": null, "isActive": false, "children": [] });
            }
            this.menus = menuList
        },
        generateColor() {
            // const rootStyles = getComputedStyle(document.documentElement);
            // const primary100Color = rootStyles.getPropertyValue('--primary-500');
            // const rgbValues = primary100Color.match(/\d+/g);
            // const hexColor = '#' + rgbValues.map(value => {
            //     const hex = parseInt(value).toString(16);
            //     return hex.length === 1 ? '0' + hex : hex;
            // }).join('');
            this.icon2FillColor = "#000000";
        },
        handleMenuClick(menu) {
            this.menus = this.menus.map((item) => { return { ...item, isActive: menu.menuUrl === item.menuUrl ? true : false } })
            this.generateColor();
        },
    },
};
</script>