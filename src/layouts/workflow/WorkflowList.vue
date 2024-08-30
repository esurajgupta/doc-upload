<template>
    <div class="bgBlue h-full w-full flex  flex-col relative ">
        <div class="flex justify-end m-2" v-if="this.userType === 'admin'">
            <Button label="Create WorkFlow +" severity="info" outlined @click="this.$router.push({
                path: '/translanding/createWorkflow',
                state: { secretData: 'This is hidden data' }
            })" />
        </div>
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl" style="width:-webkit-fill-available;">
            <div class="flex">
                <div class="grid grid-cols-12 gap-2 w-full">
                    <div class="col-span-6 flex items-center">
                        <p class="text-md font-medium text-slate-400"> Workflow List</p>
                    </div>
                </div>
            </div>
            <DataTable :value="workflow" stripedRows tableStyle="min-width: 50rem">
                <template #empty> No data found. </template>
                <Column field="workflowType.title" header="Workflow Type"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="userId.userName" header="Assigned User"></Column>
                <Column field="status.status" header="Status">
                    <!-- <template #body="{ data }">
                    <Tag :value="data.status.status" :severity="getSeverity(data.status.status)"
                        class="text-md font-medium" style="color: white" />
                </template> -->
                </Column>
                <Column field="action" header="Action" dataType="boolean" v-if="this.userType === 'user'">
                    <template #body="{ data }" class="">
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-cloud-upload" @click="this.uploadDocsForTasks(data?.taskId)"></span>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

</template>
<script>
import { constant } from '@/constants/constants';
import { fetchDBTaskList } from '@/services/task-list';

export default {
    name: "WorkFlowList",
    components: {},
    data() {
        return {
            workflow: [],
            userType: localStorage.getItem('role')
        }
    },
    methods: {
        async fetchWorkFlowData() {
            await fetchDBTaskList((res) => {
                let tempArr = res.filter((item) => item.userId.userName === localStorage.getItem("userName"));
                if (localStorage.getItem("role") === constant.adminUserName) {
                    this.workflow = res;
                } else {
                    this.workflow = tempArr;
                }
            })
        },
        async uploadDocsForTasks(taskId) {
            this.$router.push({
                path: "/translanding/uploadDocument",
                state: { taskId: taskId }
            });
        },
        onClickEyeIcon(taskId) {
            localStorage.setItem("taskId", taskId);

        }
    },
    mounted() {
        console.log(this.userType);

        this.fetchWorkFlowData();
    }
}
</script>
<style scoped></style>