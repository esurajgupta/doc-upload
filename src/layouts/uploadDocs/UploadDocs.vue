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
                        <DocumentList :docList="docList" />
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                        <Button class="btn-color rounded-none" label="Upload" />
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

export default {
    name: "UploadDocs",
    components: {
        FileUpload,
        DocumentList
    },
    data() {
        return {
            docList: ref([]),
        }
    },
    methods: {
        storeCollectedData(value) {
            console.log(value, "testing");

            const val = this.docList
            val.push(value);
        }
    }
}
</script>

<style scoped>
.bgBlue {
    background-color: #d3e4f8;
}

.btn-color {
    background-color: #b1d1f6;
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