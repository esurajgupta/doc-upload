<template>
    <div class="bgBlue h-full w-full flex justify-center items-center">
        <div class="bg-white p-4 px-3 m-2 h-fit rounded shadow-3xl">
            <div class="">
                <p class="text-xl text-slate-400">Task Creation </p>
            </div>
            <div class="grid grid-cols-12 gap-4 px-4 py-2">
                <div class="col-span-6">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">Work Flow</label>
                        <Select v-model="this.selectedWorkflow" :options="this.workflowList" optionLabel="title"
                            placeholder="Select a workflow" checkmark :highlightOnSelect="false"
                            class="w-full md:w-56" />
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">user</label>
                        <Select v-model="this.selectedUser" :options="this.userList" optionLabel="userName"
                            placeholder="Select a user" checkmark :highlightOnSelect="false" class="w-full md:w-56" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12  px-4 py-2">
                <div class="col-span-12">
                    <div class="flex flex-col gap-2 mt-2">
                        <label for="username">Description</label>
                        <textarea class="resize rounded-md textarea" rows="5" v-model="this.description"
                            :style="{ 'border': '1px solid rgb(229, 231, 235)' }"></textarea>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12  px-4 py-2">
                <div class="col-span-12">
                    <div class="flex flex-col gap-2 mt-2">
                        <Button label="Submit" severity="info" @click="this.onClickSubmit()" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>
<script>
import { createNewTask, getUserList, getWorkflowList } from "@/services/task-creation";
export default {
    data() {
        return {
            selectedUser: null,
            selectedWorkflow: null,
            description: "",
            userList: [],
            workflowList: [],
        }
    },
    methods: {
        async getUserData() {
            await getUserList((res) => {
                this.userList = res;
            });

        },
        async getWorkflowData() {
            await getWorkflowList((res) => {
                this.workflowList = res;
            });
        },
        async onClickSubmit() {
            const payload = {
                description: this.description,
                userId: this.selectedUser?.userId,
                workFlowId: this.selectedWorkflow?.workflowTypeId
            };

            await createNewTask(payload, (res) => {
                this.$toast.add({ severity: 'success', detail: 'Task Created Successfully', life: 3000 })
                this.description = "";
                this.selectedUser = null;
                this.selectedWorkflow = null;
            });

        }
    },
    mounted() {
        this.getUserData();
        this.getWorkflowData();
    },
    updated() {
        console.log(this.selectedUser, this.selectedWorkflow, this.description, "testing");

    }

}
</script>

<style scoped>
ul {
    background-color: white !important;
}

.textarea:focus {
    border: 1px solid rgb(229, 231, 235);
}
</style>