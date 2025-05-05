<template>
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
  >
    <i class="pi pi-spin pi-spinner text-4xl text-white"></i>
  </div>
  <div v-else class="h-screen overflow-y-scroll w-full">
    <div class="bg-white p-8 m-2 h-fit rounded shadow-3xl">
      <DataTable :value="deleteFileHistory" dataKey="id" tableStyle="min-width: 50rem">
        <template #empty>No records.</template>
        <Column field="entry.createdAt" header="Created Date">
          <template #body="slotProps">
            <div>{{ convertToReadableDate(slotProps.data.entry.createdAt) }}</div>
          </template>
        </Column>

        <Column field="entry.name" header="Name" />

        <Column field="entry.id" header="Restore">
          <template #body="slotProps">
            <span
              class="pi pi-undo text-primary cursor-pointer"
              style="font-size: 1.3rem"
              @click="reStoreDeleteFile(slotProps?.data.entry.id)"
            ></span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
  >
    <i class="pi pi-spin pi-spinner text-4xl text-white"></i>
  </div>
</template>

<script>
import endpoints from '@/services/endpoints'
import { httpClient } from '@/services/interceptor'
import convertToReadableDate from '@/utils/dataUtils'

export default {
  name: 'DeleteFileHistory',
  data() {
    return {
      deleteFileHistory: null,
      isLoading: false // Added loader state
    }
  },
  methods: {
    convertToReadableDate,
    async fetchDeleteFileHistory() {
      this.isLoading = true // Start loader
      try {
        const response = await httpClient.get(`${endpoints.deleteDocumentHistory}`, {
          auth: {
            username: localStorage.getItem('userName'),
            password: 'admin'
          }
        })
        this.deleteFileHistory = response?.data?.list?.entries
      } catch (error) {
        console.error('Error fetching delete file history:', error)
      } finally {
        this.isLoading = false // Stop loader
      }
    },
    async reStoreDeleteFile(id) {
      console.log('Restore file id:', id)
      this.isLoading = true // Start loader
      try {
        var payload = {}
        const response = await httpClient.post(
          `${endpoints.restoreDocument}` + `/${id}` + '/restore',
          payload,
          {
            auth: {
              username: localStorage.getItem('userName'),
              password: 'admin'
            }
          }
        )
        console.log('Restore file response:', response)
        this.fetchDeleteFileHistory()
      } catch (error) {
        console.error('Error restoring file:', error)
      } finally {
        this.isLoading = false // Stop loader
      }
    }
  },
  mounted() {
    this.fetchDeleteFileHistory()
  }
}
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #555;
}
</style>