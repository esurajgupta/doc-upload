<template>
    <div class="h-screen overflow-y-scroll w-full">
    <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
        <DataTable :value="erpTaskList" tableStyle="min-width: 50rem;min-height:10rem" paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty> No data found. </template>    
        <Column field="name" header="Workflow Name"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="created_date" header="Created Date">
                <template #body="slotProps">
                    <div>{{ convertToReadableDate(slotProps.data.created_date) }}</div>
                </template>
            </Column>
            <Column field="assignee" header="Assignee"></Column>
            <Column field="statusId" header="Status">
                <template #body="slotProps">
                    <div>{{ getTaskNameById(slotProps.data.statusId) }}</div>
                </template>
            </Column>
            <Column v-if='this.userRole=="user"' header="Action">
                <template #body="slotProps">
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-cloud-upload" @click=""></span>
                        </div>
                    </template>
            </Column>
        </DataTable>
    </div>
</div>
</template>

<script>
import { constant } from '@/constants/constants';
import endpoints from '@/services/endpoints';
import { httpClient } from '@/services/interceptor';
import convertToReadableDate from '@/utils/dataUtils';

export default {
    data() {
        return {
            erpTaskList: [],
            userRole:"",
            userName:""

        };
    },
    methods: {
        async getErpTaskList() {
            const erpTaskData = await httpClient.get(endpoints.erpTaskList)
            if(this.userRole!=constant.adminUserName){
                const filteredData= erpTaskData.data.filter((data)=>{
                if(data?.assignee && data.assignee === this.userName) {
                    return data;
                }
            })
            this.erpTaskList = filteredData
            console.log(this.erpTaskList,'erptasklist')
            }
            else {this.erpTaskList = erpTaskData.data}
            this.loading=false
            console.log(erpTaskData, "erpTaskData")
        },
        getTaskNameById(id) {
    return constant.taskStatusId[id] ;
        },
        convertToReadableDate

    },
    mounted() {
        this.userRole=localStorage.getItem("role")
        this.userName=localStorage.getItem("userName")
        this.getErpTaskList()
    }
};
</script>
