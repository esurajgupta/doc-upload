<template>

    <div class="bgBlue h-full w-full flex  flex-col relative ">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl" style="width:-webkit-fill-available;">
            <div class="card">
                <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" @rowExpand="onRowExpand"
                    @rowCollapse="onRowCollapse" tableStyle="min-width: 60rem">
                    <template #header>
                        <div class="flex flex-wrap justify-end gap-2">
                            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                        </div>
                    </template>
                    <Column expander style="width: 5rem" />
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Type"></Column>
                    <Column field="rating" header="Size"></Column>
                    <Column field="rating" header="Description"></Column>
                    <Column field="rating" header="Action">
                        <template #body="slotProps">
                            <!-- <Rating :modelValue="slotProps.data.rating" readonly /> -->
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-4">
                            <h5>Orders for {{ slotProps.data.name }}</h5>
                            <DataTable :value="slotProps.data.orders">
                                <Column field="id" header="Id" sortable></Column>
                                <Column field="customer" header="Customer" sortable></Column>
                                <Column field="date" header="Date" sortable></Column>
                                <Column field="amount" header="Amount" sortable>
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.amount) }}
                                    </template>
                                </Column>
                                <Column field="status" header="Status" sortable>
                                    <template #body="slotProps">
                                        <Tag :value="slotProps.data.status.toLowerCase()"
                                            :severity="getOrderSeverity(slotProps.data)" />
                                    </template>
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
        onRowExpand(event) {
            this.$toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
        },
        onRowCollapse(event) {
            this.$toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
        },
        expandAll() {
            this.expandedRows = this.products.reduce((acc, p) => (acc[p.id] = true) && acc, {});
        },
        collapseAll() {
            this.expandedRows = null;
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        getSeverity(product) {
            switch (product.inventoryStatus) {
                case 'INSTOCK':
                    return 'success';

                case 'LOWSTOCK':
                    return 'warn';

                case 'OUTOFSTOCK':
                    return 'danger';

                default:
                    return null;
            }
        },
        getOrderSeverity(order) {
            switch (order.status) {
                case 'DELIVERED':
                    return 'success';

                case 'CANCELLED':
                    return 'danger';

                case 'PENDING':
                    return 'warn';

                case 'RETURNED':
                    return 'info';

                default:
                    return null;
            }
        }
    }
}


</script>
<style scoped></style>