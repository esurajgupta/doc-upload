<template>


    <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
        <div>
            <ul
                class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li class="me-2" @click="this.onClickTab(0)">
                    <a href="#" aria-current="page"
                        class="inline-block p-4 text-blue-800  rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                        :class="[this.tabvalue === 0 ? 'active bg-gray-100' : '']">Task</a>
                </li>
                <li class="me-2" @click="this.onClickTab(1)">
                    <a href="#"
                        class="inline-block p-4 text-blue-800  rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                        :class="[this.tabvalue === 1 ? 'active bg-gray-100 ' : '']">History</a>
                </li>
            </ul>
        </div>
        <DataTable :value="erpTaskList" tableStyle="min-width: 50rem;min-height:10rem" paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]">
            <template #empty> No data found. </template>

            <Column field="created_date" header="Created Date">
                <template #body="slotProps">
                    <div>{{ convertToReadableDate(slotProps.data.created_date) }}</div>
                </template>
            </Column>
            <Column field="instanceData.workflowName" header="Workflow Name">
            </Column>
            <Column field="instanceData.description" header="Description"></Column>
            <Column field="instanceData.userName" header="Assignee"></Column>
            <Column field="statusId" header="Status">
                <template #body="slotProps">
                    <div>{{ tabvalue === 0 ? getTaskNameById(slotProps.data?.statusId) : "Completed"
                        }}
                    </div>
                </template>
            </Column>
        </DataTable>
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
                                    v-if="selectedDoc && selectedDoc.entry.name === item?.entry?.name"
                                    @click="getVersions(item.entry.id)"><i
                                        class="pi pi-reply text-xs  transform scale-y-[-1]"></i> {{ `Versions :
                                    ${this.versionArray.length === 0 ? "Show versions" : ""}`
                                    }}</span>
                                <span v-for="(data, index) in versionArray" :key="index"
                                    @click="getFileByVersion(data)">
                                    {{ data }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-9 w-full" style="height: 75vh;">
                    <!-- <iframe :src="pdfUrl" style="width: 100%;height:100%;" sandbox="allow-same-origin"
                        referrerpolicy="no-referrer" /> -->
                    <iframe v-if="pdfValidation" :src="pdfUrl" width="100%" height="100%"
                        type="application/pdf"></iframe>
                    <div v-else>
                        No data Found.
                    </div>
                </div>

            </div>
        </div>
        <div class="flex gap-2 justify-end mt-3" v-if="tabvalue === 0">
            <div>
                <Button label="Reject" severity="danger" size="small" style="font-size: small;"
                    @click="this.onClickAccept(1)" />
            </div>
            <div>
                <Button label="Approve" severity="success" size="small" style="font-size: small;"
                    @click="this.onClickAccept(0)" />
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
import { fetchTaskDocuments, updateIntanceData } from '@/services/task-creation';
import { approveDocument, getAlfrescoTaskList, getTaskForInstance, onApproveDocument } from '@/services/task-list';
import convertToReadableDate from '@/utils/dataUtils';

export default {
    data() {
        return {
            pdfValidation: false,
            erpTaskList: [],
            erpTaskHistory: [],
            userRole: "",
            userName: "",
            userToken: "",
            iframeUrl: `http://http://192.168.0.109:8080/content?alf_ticket=${this.userToken}`,
            visible: false,
            selectedInstance: null,
            processId: null,
            pdfUrl: null,
            documents: [],
            selectedDocs: [],
            tasks: [],
            filteredTasks: [],
            selectedDoc: null,
            copied: false,
            loading: false,
            tabvalue: 0,
            selectedProps: null,
            latestVersion: '',
            versionArray: [],
            showVersion: false


        };
    },
    methods: {
        async getVersions(documentId) {

            const res = await httpClient.get(`${endpoints.versions}/${documentId}/versions`, {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            })
            this.showVersion = !this.showVersion
            console.log(res.data?.list?.entries, "versions");
            const versionIds = res.data?.list?.entries.map((data) => {
                return data.entry.id
            })
            console.log(versionIds, "versionIds")
            this.versionArray = versionIds.join(',\n').split('\n');
        },

        async onClickTab(val) {
            this.tabvalue = val;
            if (this.tabvalue === 0) {
                const erpTaskData = await httpClient.get(endpoints.erpTaskList)
                const taskList = erpTaskData.data
                console.log(taskList, "erpTaskData.data")

                taskList.forEach((instanceDatas) => {
                    if (instanceDatas.instanceData)
                        instanceDatas.instanceData = JSON.parse(instanceDatas.instanceData)
                })

                console.log(taskList, "parsedData")
                if (this.userName !== constant.adminUserName) {
                    const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName && data.instanceData.userName === this.userName);
                    this.erpTaskList = filteredTaskList
                }
                else {
                    const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName);
                    this.erpTaskList = filteredTaskList
                }

            } else {
                const erpTaskData = await httpClient.get(endpoints.erpTaskHistory)
                const taskList = erpTaskData.data
                console.log(taskList, "erpTaskData.data")

                taskList.forEach((instanceDatas) => {
                    if (instanceDatas.instanceData)
                        instanceDatas.instanceData = JSON.parse(instanceDatas.instanceData)
                })

                console.log(taskList, "parsedData")
                if (this.userName !== constant.adminUserName) {
                    const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName && data.instanceData.userName === this.userName);
                    this.erpTaskList = filteredTaskList
                }
                else {
                    const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName);
                    this.erpTaskList = filteredTaskList
                }
            }
        },
        async getErpTaskList() {
            const erpTaskData = await httpClient.get(endpoints.erpTaskList)
            const taskList = erpTaskData.data
            console.log(taskList, "erpTaskData.data")

            taskList.forEach((instanceDatas) => {
                if (instanceDatas.instanceData)
                    instanceDatas.instanceData = JSON.parse(instanceDatas.instanceData)
            })
            console.log(taskList, "parsedData")
            if (this.userName !== constant.adminUserName) {
                const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName && data.instanceData.userName === this.userName);
                this.erpTaskList = filteredTaskList
            }
            else {
                const filteredTaskList = taskList.filter((data) => data.instanceData && data.instanceData?.userName);
                this.erpTaskList = filteredTaskList
            }
            console.log(this.erpTaskList, " sjdskjsdjsfdkdsjfk");

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
        async onClickAccept(tabId) {
            let singleInstace = {};
            console.log(this.selectedProps, "props tesing");

            await getTaskForInstance(this.selectedProps?.processInstanceId, (res) => {
                console.log(res, "instance data");
                singleInstace = res;
            });
            const instance_daata = this.selectedProps;

            console.log(instance_daata, "first instance");
            const istData = instance_daata.instanceData;
            const parsedInstance = JSON.parse(istData.data);
            const parseTemplate = JSON.parse(parsedInstance[0].templateData);
            console.log(parsedInstance, parseTemplate, "ffggssww");
            parsedInstance[0]["templateData"] = JSON.stringify(parseTemplate);
            istData["data"] = JSON.stringify(parsedInstance);
            console.log(instance_daata, "dasjkdajdsajs");
            const erpPayload = {
                ...constant.erpWorkflowTempPayload,
                business_key: istData.business_key,
                tenant_id: constant.erpWorkflowTempPayload.tenant_id,
                createdBy: constant.erpWorkflowTempPayload.createdBy,
                task_id: singleInstace.taskId,
                internal_task_id: singleInstace.internalTaskId,
                task_action: tabId === 0 ? "approve" : "reject",
                email: constant.vendorEmail,
                instance_data: {
                    ...istData,
                    statusId: tabId === 0 ? constant.taskStatus.approved : constant.taskStatus.rejected
                }
            };

            console.log(erpPayload, "second instance");
            await onApproveDocument(erpPayload, (res) => {
                console.log(res, "approve document Data");
            });
            const upInstancePayload = {
                process_instance_id: this.selectedProps?.processInstanceId,
                business_key: instance_daata?.instanceData?.business_key,
                instance_data: {
                    ...erpPayload.instance_data,
                    statusId: tabId === 0 ? constant.taskStatus.approved : constant.taskStatus.rejected
                }
            };
            console.log(instance_daata?.instanceData?.business_key, "listance data check");

            console.log(upInstancePayload, "third instance");
            await updateIntanceData(upInstancePayload, (res) => {
                console.log(res, "update instance Data");

                this.visible = !this.visible;
                if (tabId === 0) {
                    this.$toast.add({ severity: 'success', detail: "Task Approved successfully ", life: 3000 });
                } else {
                    this.$toast.add({ severity: 'success', detail: "Task Rejected successfully ", life: 3000 });

                }// this.getAlfrescoTask();
                this.getErpTaskList();
            })
        },
        async changeModalVisibilty(slotProps) {
            this.selectedProps = slotProps;
            console.log(slotProps, "data checking");
            this.selectedInstance = slotProps?.instanceData;
            console.log(this.selectedInstance?.documentId, "daf faf");
            this.visible = !this.visible;
            this.processId = this.selectedInstance?.documentId;
            this.getFiles(this.selectedInstance?.documentId);
        },
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
        async getFiles(documentId) {
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
            const userDocList = await httpClient.get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/` + findUserId(folderList?.data?.list?.entries, this.selectedInstance?.userName) + "/children", {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            });
            const finalArr = sortTaskRelatedDocs(userDocList?.data?.list?.entries, documentId); //not working
            console.log(finalArr, "finalArr");

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
                if (res.status === 200) {
                    this.pdfValidation = true
                    console.error('The file is valid PDF');
                } else {
                    this.pdfValidation = false
                    console.error('The file is not a valid PDF');
                }
            })

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
                if (res.status === 200) {
                    this.pdfValidation = true
                    console.error('The file is valid PDF');
                } else {
                    this.pdfValidation = false
                    console.error('The file is not a valid PDF');
                }
            })
        },
        async getFileByVersion(versionId) {
            console.log(versionId, "versionId")
            const filterString = versionId.replace(',', '');
            console.log(filterString, "filterString")
            await httpClient.get(endpoints.getFileUsingVersion + `/${this.selectedDoc.entry?.id}/versions/${filterString}/content`, {
                auth: {
                    username: "admin",
                    password: "admin"
                },
                responseType: 'blob'
            }).then((res) => {
                const binaryString = res?.data;
                this.pdfUrl = window.URL.createObjectURL(binaryString);
                console.log(this.pdfUrl, "pdf values")
                if (res.status === 200) {
                    this.pdfValidation = true
                    console.error('The file is valid PDF');
                } else {
                    this.pdfValidation = false
                    console.error('The file is not a valid PDF');
                }

                const blob = new Blob([res.data], { type: res.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
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
