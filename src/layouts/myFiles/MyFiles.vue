<template>
    <div class="h-screen overflow-y-scroll w-full">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
            <DataTable :value="documentlists" tableStyle="min-width: 50rem">
                <template #empty>No records.</template>
                <Column field="entry.name" header="File"></Column>
                <Column field="entry.content.mimeType" header="Content Type"></Column>
                <!-- <Column field="entry.content.mimeTypeName" header="Type Name"></Column> -->
                <Column field="entry.content.sizeInBytes" header="Size">
                    <template #body="slotProps">
                        <div>{{ bytesToMB(slotProps.data.entry.content.sizeInBytes)+"MB" }}</div>
                    </template>
                </Column>
                <Column field="entry.createdAt" header="Created Date">
                    <template #body="slotProps">
                        <div>{{ convertToReadableDate(slotProps.data.entry.createdAt) }}</div>
                    </template>
                </Column>
                <Column field="entry.createdByUser.displayName" header="Username"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import endpoints from '@/services/endpoints';
import { httpClient } from '@/services/interceptor';
import convertToReadableDate from '@/utils/dataUtils';

export default {
    data() {
        return {
            documentlists: null
        };
    },
    methods: {
        bytesToMB(bytes) {
            const megabytes = bytes / (1024 * 1024);
            return megabytes.toFixed(2); // Returns the result rounded to 2 decimal places
        },
        convertToReadableDate,
        async getAllDocuments() {
            const docsList = await httpClient.get(`${endpoints.getDocuments}`, {
                auth: {
                    username: localStorage.getItem("userName"),
                    password: "admin"
                }
            });
            const unFilteredData = docsList.data.list.entries
            console.log(unFilteredData, 'unFilteredData')
            const filteredData = unFilteredData.filter((data) => data && data.entry && data.entry.isFile === true)
            console.log(filteredData, "docsList");

            this.documentlists = filteredData
        }
    },
    mounted() {
        this.getAllDocuments();
    }
};
</script>
