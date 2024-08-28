<template>
    <div class="container bgBlue h-screen w-screen flex justify-center items-center">
        <div class="bg-white p-4 px-3 m-2 h-fit rounded shadow-3xl">
            <div class="">
                <p class="text-xl text-slate-400">Task Creation </p>
            </div>
            <div class="grid grid-cols-12 gap-4 px-4 py-2">
                <div class="col-span-6">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">Work Flow</label>
                        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City"
                            checkmark :highlightOnSelect="false" class="w-full md:w-56" />
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">Vendor</label>
                        <Select v-model="selectedCity" :options="cities" optionLabel="name"
                            placeholder="Select a Vendor" checkmark :highlightOnSelect="false" class="w-full md:w-56" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12  px-4 py-2">
                <div class="col-span-12">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">Description</label>
                        <Textarea v-model="value" rows="5" cols="30" class="rounded"
                            :style="{ 'border': '1px solid rgb(229, 231, 235)' }" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12  px-4 py-2">
                <div class="col-span-12">
                    <div class="flex flex-col gap-2 mt-2">
                        <Button label="Submit" severity="info" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getUserList, getWorkflowList } from "@/services/task-creation";
import { ref } from "vue";

const selectedCity = ref();
const value = ref("");
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

export default {
    data() {
        return {
            userList: [],
            workflowList: []
        }
    },
    methods: {
        async getUserData() {
            await getUserList((res) => {
                this.userList = res;
            });

        },
        async getWorkflowData() {
            await getWorkflowList((res) => {
                this.workflowList = res;
            });
        }
    },
    mounted() {
        this.getUserData();
        this.getWorkflowData();
    }

}
</script>

<style scoped>
.bgBlue {
    background-color: #d3e4f8;
}
</style>