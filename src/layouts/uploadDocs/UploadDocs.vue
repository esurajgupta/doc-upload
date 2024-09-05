<template>
    <div class="bgBlue h-full w-full flex justify-center ">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
            <div class="w-100">
                <p class="text-xl text-gray-500 pb-1 font-semibold">Upload your Documents </p>
                <hr class="custom-border" />
            </div>
            <div class="grid grid-cols-12 gap-8  py-2 my-2">
                <div class="col-span-6">
                    <FileUpload @uploadDocument="(val) => storeCollectedData(val)" />
                </div>
                <div class="col-span-6">
                    <p class="text-md font-medium text-slate-700">Collected Files</p>
                    <div class="min-h-10 max-h-50 w-100 overflow-x-auto mt-2">
                        <DocumentList :docList="docList" @removeSelectedDoc="(val) => removeSelectedDocument(val)" />
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                        <Button class="btn-color rounded-none" label="Upload" :disabled="!this.docList.length"
                            @click="onClickUpload()" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>

<script>
import FileUpload from '@/components/customFileUpload/FileUpload.vue';
import DocumentList from './components/DocumentList.vue';
import { ref } from 'vue';
import { assignDocToProcess, createNewProcess, getTokenForUser, uploadDocsInfoToDB, uploadDocuments } from '@/services/upload-document';
import { constant } from '@/constants/constants';
import { parserXML } from '@/constants/functions';
import router from '@/router';
import { httpClient } from '@/services/interceptor';
import { updateERPWorkflow, updateIntanceData } from '@/services/task-creation';
import { getTaskForInstance } from '@/services/task-list';

export default {
    name: "UploadDocs",
    components: {
        FileUpload,
        DocumentList
    },
    data() {
        return {
            docList: ref([]),
            taskId: window.history.state.taskId,
            taskData: JSON.parse(window.history.state.taskData),
            userToken: "",
            searchParams: new URLSearchParams(window.location.search)
        }
    },
    methods: {
        storeCollectedData(value) {
            const val = this.docList
            if (val.length > 0) {
                val.splice(0, 1, value);
            } else {
                val.push(value);
            }
            console.log(this.docList, "tsetin main arr");

        },
        removeSelectedDocument(id) {
            const arr = this.docList;
            arr.splice(id, 1);
        },
        async generateToken() {
            const userName = localStorage.getItem("userName");
            await getTokenForUser({
                userName,
                password: constant.commonUserPass
            }, (res) => {
                this.userToken = parserXML(res);

            })
        },
        async onClickUpload() {
            console.log(this.taskData, "onclickupload");
            await getTaskForInstance(this.taskData?.processInstanceId, (res) => {
                console.log(res, "snle dada");

            });
            const payload = new FormData;
            payload.append("fileData", this.docList[0]);
            payload.append("name", this.docList[0]?.name);
            payload.append("nodeType", "cm:content");
            payload.append("overwrite", true);
            await uploadDocuments({
                alf_ticket: this.userToken
            }, payload, (res) => {
                if (res && res?.status && res.status !== 201) {
                    this.$toast.add({ severity: 'error', detail: "error occured", life: 3000 });
                    return
                }
                this.$toast.add({ severity: 'success', detail: 'Uploaded Successfully', life: 3000 });
                // httpClient.get("/api/v1/documentUploaded/" + localStorage.getItem("userName"));
                this.startProcess(res?.data);
            });
        },
        // async startProcess(docDetails) {
        //     const payload = {
        //         "processDefinitionKey": "activitiReview",
        //         "variables":
        //         {
        //             "bpm_assignee": "admin"
        //         }
        //     };
        //     await createNewProcess(payload, async (res) => {
        //         if (JSON.stringify(res).includes("AxiosError")) {
        //             this.$toast.add({ severity: 'danger', detail: 'Error occurred while initiating workflow', life: 3000 });
        //         } else {
        //             httpClient.get("/api/v1/workFlowInitiate/" + `${localStorage.getItem("userName")}/${this.taskId}/${res?.entry?.id}`)
        //             const tempPayload = {
        //                 taskId: res?.entry?.id,
        //                 id: `workspace://SpacesStore/${docDetails?.entry?.id}`
        //             }
        //             await assignDocToProcess(tempPayload, (res) => {
        //                 if (JSON.stringify(res).includes("AxiosError")) {
        //                     this.$toast.add({ severity: 'danger', detail: 'Error occurred while adding document', life: 3000 });
        //                 } else {
        //                     this.$toast.add({ severity: 'success', detail: 'Workflow updated successfully', life: 3000 });
        //                 }
        //             })
        //             const docsInfoPayload = {
        //                 "taskId": parseInt(this.taskId),
        //                 "alferscoId": parseInt(res?.entry?.id),
        //                 userName: localStorage.getItem("userName"),
        //                 "documents": [
        //                     {
        //                         "uplodedDocumentId": docDetails?.entry?.id,
        //                         "documentName": docDetails?.entry?.name
        //                     },
        //                 ]
        //             };
        //             await uploadDocsInfoToDB(docsInfoPayload, (res) => {
        //                 setTimeout(() => router.push("/translanding/workflowList"), 1000);
        //             });
        //         }
        //     });
        // }
        async startProcess(docDetails) {
            let singleInstace = null;
            await getTaskForInstance(this.taskData?.processInstanceId, (res) => {
                console.log(res);
                singleInstace = res;
            });
            const instance_daata = this.taskData.instanceData;
            console.log(instance_daata, "firsrt instance");

            delete instance_daata.header;
            const parsedInstance = JSON.parse(instance_daata.data);
            const parseTemplate = JSON.parse(parsedInstance[0].templateData);
            console.log(parsedInstance, parseTemplate, "ffggssww");
            parsedInstance[0]["templateData"] = JSON.stringify(parseTemplate);
            instance_daata["data"] = JSON.stringify(parsedInstance);
            console.log(instance_daata, "dasjkdajdsajs");
            const tempPayload = {
                tenant_id: constant.erpWorkflowTempPayload.tenant_id,
                createdBy: constant.erpWorkflowTempPayload.createdBy,
                task_id: singleInstace.taskId,
                internal_task_id: singleInstace.internalTaskId,
                task_action: "approve",
                instance_data: {
                    ...instance_daata,
                    templateId: 5004,
                    templateName: "endtask",
                    mediaId: 2002,
                    taskId: singleInstace.taskId,
                    assigneename: instance_daata.userName,
                    status: "pending",
                    documentId: docDetails?.entry?.id,
                    documentName: docDetails?.entry?.name,
                    documentParentId: docDetails?.entry?.parentId,
                    statusId: constant.taskStatus.completed
                }
            };
            console.log(tempPayload, "second instance");

            await updateERPWorkflow(tempPayload, (res) => {
                console.log(res, "gokul logging");
                this.$toast.add({ severity: "success", detail: "workflow updated successfully", life: 3000 });
            });

            const upInstancePayload = {
                process_instance_id: this.taskData?.processInstanceId,
                business_key: instance_daata?.business_key,
                instance_data: {
                    ...tempPayload.instance_data
                }
            };
            console.log(upInstancePayload, "third instance");

            await updateIntanceData(upInstancePayload, (res) => {
                setTimeout(() => router.push("/translanding/myTasks"), 1000);
            })
        }
    },
    mounted() {
        this.generateToken();
        console.log(window.history.state);
    }
}
</script>

<style scoped>
.btn-color {
    background-color: #5D9FEC;
    color: #fff;
    font-weight: 500;
    font-size: small;
}

.btn-color:disabled {
    background-color: #cecdcd;
}

.custom-border {
    border: 1px solid #b1d1f6;
}
</style>