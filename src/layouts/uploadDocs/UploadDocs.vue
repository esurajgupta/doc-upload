<template>
    <div class="container bgBlue h-screen w-screen flex justify-center items-center">
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
</template>

<script>
import FileUpload from '@/components/customFileUpload/FileUpload.vue';
import DocumentList from './components/DocumentList.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { getTokenForUser, uploadDocuments } from '@/services/upload-document';
import { constant } from '@/constants/constants';
import { parserXML } from '@/constants/functions';

export default {
    name: "UploadDocs",
    components: {
        FileUpload,
        DocumentList
    },
    data() {
        return {
            docList: ref([]),
            userToken: ""
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
            const searchParams = new URLSearchParams(window.location.search);
            const userName = searchParams.get("user");
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
            });
        }
    },
    mounted() {
        this.generateToken();
    },
    updated() {
        console.log(this.docList, "testst");

    }
}
</script>

<style scoped>
.bgBlue {
    background-color: #d3e4f8;
}

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