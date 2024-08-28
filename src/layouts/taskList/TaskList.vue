<template>
    <div class="container bgBlue h-screen w-screen flex justify-center items-center">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
            <div class="flex">
                <div class="grid grid-cols-12 gap-2 w-full">
                    <div class="col-span-6 flex items-center">
                        <p class="text-md font-medium text-slate-400"> Tasklist</p>
                    </div>
                    <div class="col-span-6 flex justify-end items-center">
                        <IconField>
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="value1" placeholder="Search" size="small" />
                        </IconField>
                    </div>
                </div>
            </div>
            <DataTable :value="products" stripedRows tableStyle="min-width: 50rem">
                <Column field="code" header="Workflow"></Column>
                <Column field="name" header="User"></Column>
                <Column field="category" header="Description"></Column>
                <Column field="quantity" header="Status">
                    <template #body="{ data }">
                        <Tag :value="data.inventoryStatus" :severity="getSeverity(data.inventoryStatus)"
                            class="text-md font-medium" style="color: white" />
                    </template>
                </Column>
                <Column field="action" header="Action" dataType="boolean">
                    <template #body="{ data }" class="">
                        <!-- <IconField> -->
                        <div class="h-full w-full flex justify-start items-center pl-4">
                            <span class="pi pi-eye" @click="changeModalVisibilty()"></span>
                        </div>
                        <!-- </IconField> -->
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="visible" header="Document Verification"
        :style="{ width: '25rem', backgroundColor: '#ffffff' }" position="right" :modal="true" :draggable="false">
        <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-6 m-2 border-solid border-2 border-gray-300 rounded-full flex justify-center cursor-pointer"
                    v-for="(item, index) in this.documents">
                    {{ item.file }}
                </div>
            </div>
            <div class="flex gap-2 justify-end mt-3">
                <div>
                    <Button label="Reject" severity="danger" size="small" style="font-size: small;" />
                </div>
                <div>
                    <Button label="Approve" severity="success" size="small" style="font-size: small;" />
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script>
import { ref } from 'vue';

export default {
    name: "TaskList",
    components: {},
    data() {
        return {
            visible: false,
            documents: [{ file: "test file" }, { file: "test file4" }, { file: "test file2" }, { file: "test file3" }],
            products: ref([
                {
                    id: '1000',
                    code: 'f230fh0g3',
                    name: 'Bamboo Watch',
                    description: 'Product Description',
                    image: 'bamboo-watch.jpg',
                    price: 65,
                    category: 'Accessories',
                    quantity: 24,
                    inventoryStatus: 'OUT OF STOCK',
                    rating: 5,
                    action: false
                },
                {
                    id: '1000',
                    code: 'f230fh0g3',
                    name: 'Bamboo Watch',
                    description: 'Product Description',
                    image: 'bamboo-watch.jpg',
                    price: 65,
                    category: 'Accessories',
                    quantity: 24,
                    inventoryStatus: 'INSTOCK',
                    rating: 5,
                    action: true
                }
            ]),

        }
    },
    methods: {
        getSeverity(status) {
            switch (status) {
                case 'INSTOCK':
                    return 'danger';

                case 'OUT OF STOCK':
                    return 'success';

                case 'new':
                    return 'info';

                case 'negotiation':
                    return 'warn';

                case 'renewal':
                    return null;
            }
        },
        changeModalVisibilty() {
            this.visible = !this.visible;
        }
    }
}

</script>

<style scoped>
.bgBlue {
    background-color: #d3e4f8;
}

.pi-search {
    color: #808080;
}
</style>