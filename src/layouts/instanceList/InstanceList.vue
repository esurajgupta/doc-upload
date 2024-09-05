<template>
    <div class="h-screen overflow-y-scroll w-full">
        <div class="bg-white p-8  m-2 h-fit rounded shadow-3xl">
            <DataTable :value="instanceList" tableStyle="min-width: 50rem;min-height:10rem;max-width:70rem" paginator
                :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                <template #empty> No data found. </template>
                <Column field="workflowDate" header="Workflow Date">
                    <template #body="slotProps">
                        <div>{{ convertToReadableDate(getWorkflowDate(slotProps.data.workflowDate)) }}</div>
                    </template>
                </Column>
                <Column field="taskName" header="Task Name">
                    <!-- <template #body="slotProps"> -->
                    <!-- <div>{{ tabvalue === 0 ? getTaskNameById(slotProps.data?.instanceData?.statusId) : "Completed"
                            }}
                        </div> -->
                    <!-- </template> -->
                </Column>
                <Column field="taskDate" header="Task Date">
                    <template #body="slotProps">
                        <div @click="console.log(slotProps.data.taskdate)">

                            {{ convertToReadableDate(slotProps.data.taskdate) }}
                        </div>
                    </template>
                </Column>
                <Column field="dueDate" header="Due Date">
                    <template #body="slotProps">
                        <div>

                            {{ convertToReadableDate(slotProps.data.duedate) }}
                        </div>
                    </template>
                </Column>
                <!-- <Column field="eventName" header="Event name"></Column> -->
                <Column field="description" header="Description"></Column>

                <Column field="status" header="Status">
                    <template #body="slotProps">
                        {{ getTaskNameById(slotProps.data.status) }}
                    </template>
                </Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <span class="pi pi-history" :class="'text-primary'" :style="'font-size: 1.3rem'"
                            @click="changeModalVisibility(slotProps)">
                        </span>
                    </template>

                </Column>
            </DataTable>
            <Dialog v-model:visible="modalVisibility" header="Workflow list"
                :style="{ width: '55vw', backgroundColor: '#ffffff' }" position="center" :modal="true"
                :draggable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <!-- <OrganizationChart :value="data">
                    <template #default="slotProps">
                        <span>{{ slotProps.node.label }}</span>
                    </template>
                </OrganizationChart> -->
            </Dialog>
            <Dialog v-model:visible="taskHistory" header="Instance History"
                :style="{ width: '75vw', backgroundColor: '#ffffff' }" position="center" :modal="true"
                :draggable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <!-- <TaskList /> -->
                <MyTasks />
            </Dialog>

        </div>
    </div>
</template>
<script>
import { constant } from "@/constants/constants";
import { fetchSingleInstance, fetchSingleInstanceForUsertasks, fetchSingleWorkflowVersion, getEventList, getUserTaskHistory, getUserTasks } from "@/services/instanceList";
import convertToReadableDate from "@/utils/dataUtils";
import { VoBasic } from "vue-orgchart";
import TaskList from "../taskList/TaskList.vue";
import MyTasks from "../myTasks/MyTasks.vue";
export default {

    name: "InstanceList",
    components: { VoBasic },
    data() {
        return {
            instanceList: [],
            modalVisibility: false,
            eventListArr: [],
            selectedProcessInstanceId: window.history.state.prInsId,
            workflowVersionList: [],
            taskHistory: false,
            data: {
                label: 'Argentina',
                children: [
                    {
                        label: 'Argentina',
                    },
                ]
            }
        }
    },
    components: {
        TaskList,
        MyTasks
    },
    methods: {
        changeModalVisibility(slotProps) {
            this.taskHistory = true; // Show the dialog
        },

        convertToReadableDate,
        getTaskNameById(id) {
            return constant.taskStatusId[id];
        },
        getEventName(id) {
            if (id) {
                const result = this.eventListArr.find((item) => item?.eventId == id);
                return result?.name;
            }
        },
        async alignTableData(response) {

        },
        getWorkflowDate(id) {
            const result = this.workflowVersionList.find((item) => item?.workflowVersionId == id);
            if (result) {
                return result?.created_date;
            } else {
                return ""
            }

        },
        async fetchUserTasks() {
            const arr = this.instanceList;
            await getUserTasks((res) => {
                res.map(async (item, index) => {
                    const tempObj = {
                        description: item.description,
                        taskName: item.name,
                        taskdate: item.created_date,
                        duedate: item.dueDate,
                        status: item.statusId,
                        processInstanceId: item.processInstanceId
                    };
                    await fetchSingleInstanceForUsertasks(item?.processInstanceId, async (res) => {
                        console.log(res, "daeerere");
                        tempObj["eventName"] = this.getEventName(res?.eventId);
                        tempObj["workflowDate"] = res?.workflowVersionId;

                    })
                    arr.push(tempObj);
                    if (this.selectedProcessInstanceId === null || this.selectedProcessInstanceId === undefined) {
                        this.instanceList = arr;
                    } else {
                        this.instanceList = arr.filter((item) => item?.processInstanceId === this.selectedProcessInstanceId);
                    }
                    console.log(arr, index);
                })
            })
        },
        async fetchUserHistory() {
            const arr = this.instanceList;
            await getUserTaskHistory((res) => {
                res.map(async (item, index) => {
                    const tempObj = {
                        description: item.description,
                        taskName: item.name,
                        taskdate: item.created_date,
                        duedate: item.dueDate,
                        status: item.statusId,
                        processInstanceId: item.processInstanceId
                        // eventName: this.getEventName(item.)
                    };
                    await fetchSingleInstance(item?.processInstanceId, async (res) => {
                        tempObj["eventName"] = this.getEventName(res?.eventId);
                        tempObj["workflowDate"] = res?.workflowVersionId;
                    })
                    arr.push(tempObj);
                    console.log(this.selectedProcessInstanceId, "selectedprocessinsta");

                    if (this.selectedProcessInstanceId === null || this.selectedProcessInstanceId === undefined) {
                        console.log("1 workgin");
                        this.instanceList = arr;
                    } else {
                        console.log("2 workgin")
                        this.instanceList = arr.filter((item) => item?.processInstanceId === this.selectedProcessInstanceId);
                    }
                    console.log(arr, index);
                })
            });
            await this.fetchUserTasks();
            console.log(this.instanceList, "instace");
        }
    },
    async mounted() {
        console.log(window.history.state);

        await getEventList((res) => {
            this.eventListArr = res;
        });
        await fetchSingleWorkflowVersion((resp) => {
            this.workflowVersionList = resp;
        })
        await this.fetchUserHistory();
    }
}
</script>
<style scoped></style>