<template>
    <div class="card flex justify-center absolute z-10 w-full h-full  items-center hidden">
        <ProgressSpinner fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="bgBlue h-full w-full flex  flex-col relative ">
        <div class="flex justify-end m-2">
            <Button label="Create Task" severity="info" outlined />
        </div>
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl" style="width:-webkit-fill-available;">
            <div class="flex">
                <div class="grid grid-cols-12 gap-2 w-full">
                    <div class="col-span-6 flex items-center">
                        <p class="text-md font-medium text-slate-400"> Tasklist</p>
                    </div>
                    <div class="col-span-6 flex justify-end items-center">
                        <IconField>
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="value1" placeholder="Search" size="small" />
                        </IconField>
                    </div>
                </div>
            </div>
            <div>
                <ul
                    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li class="me-2" @click="this.onClickTab(0)">
                        <a href="#" aria-current="page"
                            class="inline-block p-4 text-blue-600  rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                            :class="[this.tabvalue === 0 ? 'active bg-gray-100  textBlue' : '']">Active</a>
                    </li>
                    <li class="me-2" @click="this.onClickTab(1)">
                        <a href="#"
                            class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                            :class="[this.tabvalue === 1 ? 'active bg-gray-100  textBlue' : '']">Completed</a>
                    </li>
                </ul>

            </div>

            <DataTable :value="tasks" stripedRows tableStyle="min-width: 50rem">
                <Column field="entry.name" header="Task Name"></Column>
                <Column field="entry.description" header="Task Description"></Column>
                <Column field="entry.activityDefinitionId" header="Status"></Column>
                <Column field="entry.assignee" header="Assignee">
                    <!-- <template #body="{ data }">
                        <Tag :value="data.status.status" :severity="getSeverity(data.status.status)"
                            class="text-md font-medium" style="color: white" />
                    </template> -->
                </Column>
                <Column field="action" header="Action" dataType="boolean">
                    <template #body="{ data }" class="">
                        <!-- <IconField> -->
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-eye" @click="changeModalVisibilty(data?.entry?.processId)"></span>
                        </div>
                        <!-- </IconField> -->
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="visible" header="Document Verification"
        :style="{ width: '25rem', backgroundColor: '#ffffff' }" position="right" :modal="true" :draggable="false">
        <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-6 m-2 border-solid border-2 border-gray-300 rounded-full flex justify-center cursor-pointer"
                    v-for="(item, index) in this.documents">
                    {{ item.file }}
                </div>
            </div>
            <div class="flex gap-2 justify-end mt-3">
                <div>
                    <Button label="Reject" severity="danger" size="small" style="font-size: small;"
                        @click="this.onClickReject()" />
                </div>
                <div>
                    <Button label="Approve" severity="success" size="small" style="font-size: small;" />
                </div>
            </div>
        </div>
    </Dialog>
    <!-- <ProgressSpinner /> -->
    <Toast />
</template>

<script>
import { findUserFolderId, findUserId, sortTaskRelatedDocs } from '@/constants/functions';
import endpoints from '@/services/endpoints';
import { httpClient } from '@/services/interceptor';
import { fetchTaskDocuments } from '@/services/task-creation';
import { approveDocument, getAlfrescoTaskList } from '@/services/task-list';
import { ref } from 'vue';

export default {
    name: "TaskList",
    components: {},
    data() {
        return {
            userToken: "",
            visible: false,
            selectedTask: null,
            tabvalue: 0,
            documents: [{ file: "test file" }, { file: "test file4" }, { file: "test file2" }, { file: "test file3" }],
            tasks: ref([]),
        }
    },
    methods: {
        onClickTab(val) {
            console.log("method worinf");

            this.tabvalue = val;
        },
        getSeverity(status) {
            switch (status) {
                case 'Cancelled':
                    return 'danger';

                case 'Completed':
                    return 'success';

                case 'In progress':
                    return 'info';

                case 'On hold':
                    return 'warn';

                case 'Not yet started':
                    return null;
            }
        },
        async onClickReject() {
            const payload = {
                payload: {
                    "state": "completed",
                    "variables": [
                        {
                            "name": "bpm_priority",
                            "type": "d_int",
                            "value": 1,
                            "scope": "global"
                        }
                    ]
                },
                taskId: this.selectedTask
            };
            await approveDocument(payload, (res) => {
                this.visible = !this.visible;
                if (res && res?.status && res.status === 200) {
                    this.$toast.add({ severity: 'success', detail: "Task rejected successfully ", life: 3000 });
                } else {
                    this.$toast.add({ severity: 'error', detail: "error occured", life: 3000 });
                }

                console.log(res);

            })
        },
        // async changeModalVisibilty(userName) {
        //     await getTokenForUser({
        //         userName,
        //         password: constant.commonUserPass
        //     }, (res) => {
        //         this.userToken = parserXML(res);
        //         this.getFiles(this.userToken)
        //     })
        //     this.visible = !this.visible;
        // },
        async changeModalVisibilty(taskId) {
            console.log(taskId);
            this.selectedTask = taskId;
            this.visible = !this.visible;
            this.getFiles(taskId);
        },
        async getTaskList() {
            const response = await httpClient.get(endpoints.getTasklistURL);
            this.tasks = response.data
        },
        async getAlfrescoTask() {
            await getAlfrescoTaskList((res) => {
                this.tasks = res?.list?.entries;
                console.log(res, "ffofofo");

            });
        },
        async getFiles(taskId) {

            await fetchTaskDocuments(taskId, (res) => {
                // const finalArr = sortTaskRelatedDocs(docsList, res);
                this.documents = res;
            });
            const docsList = await httpClient.get(`${endpoints.getDocuments}`, {
                auth: {
                    username: "admin",
                    password: "admin"
                }
            });
            const folderList = await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/` + findUserFolderId(docsList?.data?.list?.entries) + "/children", {
                auth: {
                    username: "admin",
                    password: "admin"
                }
            });
            const userDocList = await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/` + findUserId(folderList?.data?.list?.entries, this.documents[0].split(",").pop()) + "/children", {
                auth: {
                    username: "admin",
                    password: "admin"
                }
            });
            console.log(userDocList, "test");

        }
    },
    mounted() {
        // this.getTaskList();
        this.getAlfrescoTask();
    }
}

</script>

<style scoped>
a {
    color: inherit;
}

.textBlue {
    color: hsla(160, 100%, 37%, 1) !important;
}


.pi-search {
    color: #808080;
}
</style>