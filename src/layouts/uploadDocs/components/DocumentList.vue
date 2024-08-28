<template>
    <div class="flex w-full">
        <div class="grid grid-cols-12 w-full gap-4">
            <div v-for="(item, index) in this.docList" class="col-span-12 p-2 flex flex-col bg-slate-50">
                <div class="flex flex-row ">
                    <div class="flex-1">
                        <p :title="item.name">{{ stringShortner(item.name) }}</p>
                    </div>
                    <div class="flex-1flex justify-end">
                        <div @click="removeDocument(index)" style="cursor: pointer;">
                            <Image :src="imag" width="15" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import img from "@/assets/icons8-x-24.png";

export default {
    name: "DocumentList",
    components: {},
    props: {
        docList: {
            type: Array
        }
    },
    data() {
        return {
            documentList: ref([{ filename: "test fileName1" }, { filename: "test fileName 2" }, { filename: "test fileName3" }, { filename: "test fileName 4" }]),
            imag: img
        }
    },
    methods: {
        removeDocument(docId) {
            const val = this.documentList
            val.splice(docId, 1);
            console.log(docId);

        },
        stringShortner(str) {
            if (str && str.length > 34) {
                return str.substring(0, 26) + "...";
            } else {
                return str;
            }
        }
    }

}
</script>
<style scoped></style>