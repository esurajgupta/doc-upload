<template>

    <div class="bgBlue h-full w-full flex  flex-col relative ">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl" style="width:-webkit-fill-available;">
            <div class="card">
                <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" tableStyle="min-width: 60rem">
                    <template #header>
                        <div class="flex flex-wrap justify-end gap-2">
                            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                        </div>
                    </template>
                    <Column expander style="width: 5rem" />
                    <Column field="name" header="Name"></Column>
                    <Column field="code" header="Type"></Column>
                    <Column field="rating" header="Size"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="category" header="Action">
                        <template #body="slotProps">
                            <!-- <Rating :modelValue="slotProps.data.rating" readonly /> -->
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-4">
                            <!-- <h5>Orders for {{ slotProps.data.name }}</h5> -->
                            <DataTable :value="slotProps.data.orders">
                                <Column field="id" header="Id" sortable></Column>
                                <Column field="customer" header="Customer" sortable></Column>
                                <Column field="date" header="Date" sortable></Column>
                                <Column field="amount" header="Amount" sortable>
                                </Column>
                                <Column field="status" header="Status" sortable>
                                </Column>
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
                <Toast />
            </div>
        </div>
    </div>
</template>
<script>
import { FileService } from '@/services/file-list/fileList';
export default {
    name: "MyFiles",
    components: {},
    data() {
        return {
            products: null,
            expandedRows: {}
        }
    },

    methods: {
        expandAll() {
            this.expandedRows = this.products.reduce((acc, p) => (acc[p.id] = true) && acc, {});
        },
        collapseAll() {
            this.expandedRows = null;
        },
        
    },
    mounted() {
    this.products = FileService.getProductsWithOrdersData();
}

}


</script>
<style scoped></style>