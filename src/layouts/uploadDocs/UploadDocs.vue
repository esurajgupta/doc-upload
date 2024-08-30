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
            userToken: "",
            searchParams: new URLSearchParams(window.location.search)
        }
    },
    methods: {
        storeCollectedData(value) {
            console.log(value, "testing");

            const val = this.docList
            if (val.length > 0) {
                val.splice(0, 1, value);
            } else {
                val.push(value);
            }
            console.log(this.docList, "tsetin main arr");

        },
        removeSelectedDocument(id) {
            console.log(id, "checking id");

            const arr = this.docList;
            arr.splice(id, 1);
            console.log(arr, "checking temp arr");
            console.log(this.docList, "checking doclist");


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
            const payload = new FormData;
            payload.append("fileData", this.docList[0]);
            payload.append("name", this.docList[0]?.name);
            payload.append("nodeType", "cm:content");

            await uploadDocuments({
                alf_ticket: this.userToken
            }, payload, (res) => {
                console.log(res);
                console.log(res?.data?.error?.briefSummary);

                if (res && res?.status && res.status !== 201) {
                    console.log("work");

                    this.$toast.add({ severity: 'error', detail: "error occured", life: 3000 });
                    return
                }
                this.$toast.add({ severity: 'success', detail: 'Uploaded Successfully', life: 3000 });
                httpClient.get("/api/v1/documentUploaded/" + localStorage.getItem("userName"));
                this.startProcess(res?.data);
            });
        },
        async startProcess(docDetails) {
            const payload = {
                "processDefinitionKey": "activitiReview",
                "variables":
                {
                    "bpm_assignee": "admin"
                }
            };
            await createNewProcess(payload, async (res) => {
                if (JSON.stringify(res).includes("AxiosError")) {
                    this.$toast.add({ severity: 'danger', detail: 'Error occurred while initiating workflow', life: 3000 });
                } else {
                    this.$toast.add({ severity: 'success', detail: 'WorkFlow initiated sucessfully', life: 3000 });
                    httpClient.get("/api/v1/workFlowInitiate/" + `${localStorage.getItem("userName")}/${this.taskId}/${res?.entry?.id}`)
                    const tempPayload = {
                        taskId: res?.entry?.id,
                        id: `workspace://SpacesStore/${docDetails?.entry?.id}`
                    }
                    await assignDocToProcess(tempPayload, (res) => {
                        if (JSON.stringify(res).includes("AxiosError")) {
                            this.$toast.add({ severity: 'danger', detail: 'Error occurred while adding document', life: 3000 });
                        } else {
                            this.$toast.add({ severity: 'success', detail: 'Workflow updated successfully', life: 3000 });
                        }
                    })

                    const docsInfoPayload = {
                        "taskId": parseInt(this.taskId),
                        "alferscoId": parseInt(res?.entry?.id),
                        userName: localStorage.getItem("userName"),
                        "documents": [
                            {
                                "uplodedDocumentId": docDetails?.entry?.id,
                                "documentName": docDetails?.entry?.name
                            },
                        ]
                    };
                    await uploadDocsInfoToDB(docsInfoPayload, (res) => {
                        setTimeout(() => router.push("/translanding/workflowList"), 1000);
                    });
                }
            });
        }
    },
    mounted() {
        this.generateToken();
        console.log(window.history.state);


    },
    updated() {
        console.log(this.docList, "testst");
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