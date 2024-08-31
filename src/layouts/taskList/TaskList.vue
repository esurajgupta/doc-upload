<template>
    <div class="card flex justify-center absolute z-10 w-full h-full  items-center hidden">
        <ProgressSpinner fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="bgBlue h-screen  overflow-y-scroll w-full flex  flex-col relative ">
        <!-- <div class="flex justify-end m-2">
            <Button label="Create Task" severity="info" outlined
                @click="this.$router.push('/translanding/createTask')" />
        </div> -->
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl" style="width:-webkit-fill-available;">
            <!-- <div class="flex">
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
            </div> -->
            <div>
                <ul
                    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li class="me-2" @click="this.onClickTab(0)">
                        <a href="#" aria-current="page"
                            class="inline-block p-4 text-blue-800  rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                            :class="[this.tabvalue === 0 ? 'active bg-gray-100' : '']">Active</a>
                    </li>
                    <li class="me-2" @click="this.onClickTab(1)">
                        <a href="#"
                            class="inline-block p-4 text-blue-800  rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                            :class="[this.tabvalue === 1 ? 'active bg-gray-100 ' : '']">Completed</a>
                    </li>
                </ul>
            </div>
            <DataTable :value="filteredTasks" stripedRows tableStyle="min-width: 50rem" paginator :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]">
                <template #empty> No data found. </template>
                <Column field="entry.name" header="Task Name"></Column>
                <Column field="entry.description" header="Task Description"></Column>
                <Column field="entry.activityDefinitionId" header="Status"></Column>
                <Column field="entry.assignee" header="Assignee">
                    <!-- <template #body="{ data }">
                        <Tag :value="data.status.status" :severity="getSeverity(data.status.status)"
                            class="text-md font-medium" style="color: white" />
                    </template> -->
                </Column>
                <Column field="action" header="Action" dataType="boolean"
                    :class="[this.tabvalue === 1 ? 'hidden' : '']">
                    <template #body="{ data }">
                        <!-- <IconField> -->
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-file-edit text-primary" style="font-size: 1.3rem"
                                @click="changeModalVisibilty(data?.entry?.id, data?.entry?.processId)"></span>
                        </div>
                        <!-- </IconField> -->
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="visible" header="Document Verification"
        :style="{ width: '75vw', backgroundColor: '#ffffff' }" position="center" :modal="true" :draggable="false"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-col bg-slate-50 p-1">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-3">
                    <div class="">
                        <p class="text-lg font-medium text-slate-500">Uploaded Documents</p>
                    </div>
                    <div class="grid grid-cols-12 ">
                        <div class="col-span-12 mt-2 rounded flex cursor-pointer"
                            v-for="(item, index) in this.selectedDocs" @click="this.getPdfFile(item)">
                            <div class="flex flex-col">
                                <span class="text-md font-bold"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name">File</span>
                                <span class="text-sm">{{ index + 1 + ". " + item?.entry?.name }} <i v-if="!this.copied"
                                        @click="copyToClipboard(item)"
                                        class="pi pi-copy text-lg transform scale-y-[-1]"></i></span>
                                <span class="text-md font-bold"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name">Properties</span>
                                <span class="text-sm"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs transform scale-y-[-1]"></i> {{ `Mimetype :
                                    ${item?.entry?.content.mimeTypeName}` }}</span>
                                <span class="text-sm"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs transform scale-y-[-1]"></i> {{ `Size :
                                    ${bytesToMB(item?.entry?.content?.sizeInBytes)} MB` }}</span>
                                <span class="text-sm"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs transform scale-y-[-1]"></i> {{ `Creator :
                                    ${item?.entry?.createdByUser?.displayName}` }}</span>
                                <span class="text-sm "
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs  transform scale-y-[-1]"></i> {{ `Created At :
                                    ${formatDate(new Date(item?.entry?.createdAt))}` }}</span>
                                <span class="text-md font-bold"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name">Version
                                    History</span>
                                <span class="text-sm"
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs transform scale-y-[-1]"></i> {{ `Modifier :
                                    ${item?.entry?.modifiedByUser?.displayName}` }}</span>
                                <span class="text-sm "
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs  transform scale-y-[-1]"></i> {{ `Modified At :
                                    ${formatDate(new Date(item?.entry?.modifiedAt))}` }}</span>
                                <span class="text-sm "
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"><i
                                        class="pi pi-reply text-xs  transform scale-y-[-1]"></i> {{ `(No Comment)`
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-9 w-full" style="height: 75vh;">
                    <!-- <iframe :src="pdfUrl" style="width: 100%;height:100%;" sandbox="allow-same-origin"
                        referrerpolicy="no-referrer" /> -->
                    <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%" type="application/pdf"></iframe>
                </div>

            </div>
        </div>
        <div class="flex gap-2 justify-end mt-3">
            <div>
                <Button label="Reject" severity="danger" size="small" style="font-size: small;"
                    @click="this.onClickReject()" />
            </div>
            <div>
                <Button label="Approve" severity="success" size="small" style="font-size: small;"
                    @click="this.onClickAccept()" />
            </div>
        </div>
    </Dialog>
    <!-- <ProgressSpinner /> -->
    <Toast />
</template>

<script>
import { findUserFolderId, findUserId, parserXML, sortTaskRelatedDocs } from '@/constants/functions';
import endpoints from '@/services/endpoints';
import { httpClient } from '@/services/interceptor';
import { fetchTaskDocuments } from '@/services/task-creation';
import { approveDocument, getAlfrescoTaskList } from '@/services/task-list';
import { getTokenForUser } from '@/services/upload-document';
import { ref } from 'vue';
import { constant } from "@/constants/constants";
export default {
    name: "TaskList",
    components: {},
    data() {
        return {
            userToken: "",
            iframeUrl: `http://localhost:8080/content?alf_ticket=${this.userToken}`,
            visible: false,
            selectedTask: null,
            processId: null,
            tabvalue: 0,
            pdfUrl: null,
            documents: [],
            selectedDocs: [],
            tasks: [],
            filteredTasks: [],
            selectedDoc: null,
            copied: false,
        }
    },
    methods: {
        onClickTab(val) {
            console.log("method worin");
            this.tabvalue = val;
            if (this.tabvalue === 0) {
                this.filteredTasks = this.tasks.filter((item) => item?.entry?.activityDefinitionId === constant.reviewId)
            } else {
                this.filteredTasks = this.tasks.filter((item) => item?.entry?.activityDefinitionId !== constant.reviewId)
            }
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
                    httpClient.get("/api/v1/documentRejected/" + this.documents[0].split(",").pop() + `/${this.processId}`);
                    this.getAlfrescoTask();


                } else {
                    this.$toast.add({ severity: 'error', detail: "error occured", life: 3000 });
                }

                console.log(res);

            })
        },
        async onClickAccept() {
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
                    this.$toast.add({ severity: 'success', detail: "Task Approved successfully ", life: 3000 });
                    httpClient.get("/api/v1/documentRejected/" + this.documents[0].split(",").pop() + `/${this.processId}`);
                    this.getAlfrescoTask();


                } else {
                    this.$toast.add({ severity: 'error', detail: "error occured", life: 3000 });
                }

                console.log(res);

            })
        },
        async changeModalVisibilty(taskId, processId) {
            console.log(taskId);
            this.selectedTask = taskId;
            this.visible = !this.visible;
            this.processId = processId;
            this.getFiles(processId);
        },
        // async getTaskList() {
        //     const response = await httpClient.get(endpoints.getTasklistURL);
        //     this.tasks = response.data
        // },
        async getAlfrescoTask() {
            await getAlfrescoTaskList((res) => {
                this.tasks = res?.list?.entries;
                if (this.tabvalue === 0) {
                    this.filteredTasks = this.tasks.filter((item) => item?.entry?.activityDefinitionId === constant.reviewId)
                } else {
                    this.filteredTasks = this.tasks.filter((item) => item?.entry?.activityDefinitionId !== constant.reviewId)
                }
                console.log(this.tasks);

            });
        },
        async getFiles(taskId) {
            await fetchTaskDocuments(taskId, (res) => {
                // const finalArr = sortTaskRelatedDocs(docsList, res);
                this.documents = res;
            });
            const docsList = await httpClient.get(`${endpoints.getDocuments}`, {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            });
            const folderList = await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/` + findUserFolderId(docsList?.data?.list?.entries) + "/children", {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            });
            const userDocList = await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/` + findUserId(folderList?.data?.list?.entries, this.documents[0].split(",").pop()) + "/children", {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            });
            // const finalArr = sortTaskRelatedDocs(userDocList?.data?.list?.entries, this.documents); //not working
            const finalArr = userDocList?.data?.list?.entries;
            this.selectedDocs = finalArr;
            this.selectedDoc = finalArr[0];
            await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${finalArr[0]?.entry?.id}/content`, {
                auth: {
                    username: "admin",
                    password: "admin"
                },
                responseType: 'blob'
            }).then((res) => {
                const binaryString = res?.data;
                this.pdfUrl = window.URL.createObjectURL(binaryString);
            })
            console.log(finalArr);

            console.log(userDocList?.data?.list?.entries, this.documents);

        },
        async getPdfFile(item) {
            this.selectedDoc = item;
            await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${item?.entry?.id}/content`, {
                auth: {
                    username: "admin",
                    password: "admin"
                },
                responseType: 'blob'
            }).then((res) => {
                const binaryString = res?.data;
                this.pdfUrl = window.URL.createObjectURL(binaryString);
            })
        },
        bytesToMB(bytes) {
            const megabytes = bytes / (1024 * 1024);
            return megabytes.toFixed(2); // Returns the result rounded to 2 decimal places
        },
        copyToClipboard(item) {
            navigator.clipboard.writeText(this.pdfUrl).then(() => {
                this.copied = true;
                setTimeout(() => {
                    this.copied = false; // Reset the copied message after 2 seconds
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        }

    },
    mounted() {
        // this.getTaskList();
        console.log(constant, "fdsfas");

        this.getAlfrescoTask();
        getTokenForUser({
            userName: "admin",
            password: "admin"
        }, (res) => {
            this.userToken = parserXML(res);
        })
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