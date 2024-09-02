<template>
    <div class="h-screen overflow-y-scroll w-full">
        <div class="flex justify-end m-2" v-if="this.userRole === 'admin'">
            <Button label="Create Workflow +" class=" text-white" @click="this.$router.push({
                path: '/translanding/createWorkflow',
                state: { secretData: 'This is hidden data' }
            })" />
        </div>
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
            <DataTable :value="erpTaskList" tableStyle="min-width: 50rem;min-height:10rem" paginator :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]">
                <template #empty> No data found. </template>
                <Column field="instanceData.workflowName" header="Workflow Name">
                </Column>
                <Column field="instanceData.description" header="Description"></Column>
                <Column field="created_date" header="Created Date">
                    <template #body="slotProps">
                        <div>{{ convertToReadableDate(slotProps.data.created_date) }}</div>
                    </template>
                </Column>
                <Column field="instanceData.userName" header="Assignee"></Column>
                <Column field="statusId" header="Status">
                    <template #body="slotProps">
                        <div>{{ getTaskNameById(slotProps.data.statusId) }}</div>
                    </template>
                </Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-cloud-upload" v-if="this.userRole === 'user'" @click=" this.$router.push({
                                path: '/translanding/uploadDocument',
                            })"></span>
                            <span class="pi pi-file-edit text-primary" style="font-size: 1.3rem"
                                @click="changeModalVisibilty(slotProps?.data?.entry?.id, slotProps?.data?.entry?.processId)"></span>
                        </div>
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
    <Toast />
</template>

<script>
import { constant } from '@/constants/constants';
import { findUserFolderId, findUserId, sortTaskRelatedDocs } from '@/constants/functions';
import endpoints from '@/services/endpoints';
import { httpClient } from '@/services/interceptor';
import { fetchTaskDocuments } from '@/services/task-creation';
import { approveDocument, getAlfrescoTaskList } from '@/services/task-list';
import convertToReadableDate from '@/utils/dataUtils';

export default {
    data() {
        return {
            erpTaskList: [],
            userRole: "",
            userName: "",
            userToken: "",
            iframeUrl: `http://http://192.168.0.109:8080/content?alf_ticket=${this.userToken}`,
            visible: false,
            selectedTask: null,
            processId: null,
            pdfUrl: null,
            documents: [],
            selectedDocs: [],
            tasks: [],
            filteredTasks: [],
            selectedDoc: null,
            copied: false,
            loading: false,

        };
    },
    methods: {
        async getErpTaskList() {
            // const erpTaskData = await httpClient.get(endpoints.erpTaskList)
            // if (this.userRole != constant.adminUserName) {
            //     const filteredData = erpTaskData.data.filter((data) => {
            //         if (data?.assignee && data.assignee === this.userName) {
            //             return data;
            //         }
            //     })
            //     this.erpTaskList = filteredData
            //     console.log(this.erpTaskList, 'erptasklist')
            // }
            // else { this.erpTaskList = erpTaskData.data }
            const erpTaskData = await httpClient.get(endpoints.erpTaskList)
            const taskList = erpTaskData.data
            console.log(taskList, "erpTaskData.data")

            taskList.forEach((instanceDatas) => {
                if(instanceDatas.instanceData)
                instanceDatas.instanceData = JSON.parse(instanceDatas.instanceData)
            })
            taskList.forEach((instanceDatas) => {
                if(instanceDatas.instanceData.data)
                instanceDatas.instanceData.data = JSON.parse(instanceDatas.instanceData.data)
            })

            console.log(taskList, "parsedData")
            const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName);
            this.erpTaskList = filteredTaskList
            this.loading = false
        },
        getTaskNameById(id) {
            return constant.taskStatusId[id];
        },
        convertToReadableDate,
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
            console.log(taskId, "taskId");
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
                    this.loading = false;
                    this.filteredTasks = this.tasks.filter((item) => item?.entry?.activityDefinitionId === constant.reviewId)
                } else {
                    this.loading = false;
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
            const finalArr = sortTaskRelatedDocs(userDocList?.data?.list?.entries, this.documents); //not working
            // const finalArr = userDocList?.data?.list?.entries;
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
        this.userRole = localStorage.getItem("role")
        this.userName = localStorage.getItem("userName")
        this.getErpTaskList()
    }
};
</script>
