<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p class="text-gray-500 mt-1">Manage events and export bookings</p>
      </div>
      <div class="flex gap-3">
        <button @click="handleExport" :disabled="exporting" class="btn-secondary flex items-center gap-2">
          <span>{{ exporting ? '⏳' : '📥' }}</span>
          {{ exporting ? 'Exporting...' : 'Export CSV' }}
        </button>
        <button @click="openCreate" class="btn-primary flex items-center gap-2">
          <span>＋</span> New Event
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="card text-center">
        <p class="text-3xl font-bold text-primary-600">{{ pagination.total || 0 }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Events</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ availableEvents }}</p>
        <p class="text-sm text-gray-500 mt-1">Available</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-red-600">{{ soldOutEvents }}</p>
        <p class="text-sm text-gray-500 mt-1">Sold Out</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-600">{{ totalSeatsBooked }}</p>
        <p class="text-sm text-gray-500 mt-1">Seats Booked</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card animate-pulse h-52"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!events.length" class="text-center py-20">
      <div class="text-5xl mb-4">📋</div>
      <p class="text-gray-500 text-lg">No events yet</p>
      <button @click="openCreate" class="btn-primary mt-4 px-8">Create First Event</button>
    </div>

    <!-- Events Table -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="event in events" :key="event._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{{ event.name }}</td>
              <td class="px-6 py-4 text-gray-600">{{ formatDate(event.date) }}</td>
              <td class="px-6 py-4 text-gray-600">{{ event.capacity }}</td>
              <td class="px-6 py-4">
                <span :class="event.availableSeats === 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                  {{ event.availableSeats }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="event.availableSeats === 0 ? 'badge-danger' : event.availableSeats <= 10 ? 'badge-info' : 'badge-success'">
                  {{ event.availableSeats === 0 ? 'Sold Out' : event.availableSeats <= 10 ? 'Almost Full' : 'Available' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <button @click="openEdit(event)" class="btn-secondary text-xs px-3 py-1.5">Edit</button>
                  <button @click="confirmDelete(event)" class="btn-danger text-xs px-3 py-1.5">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p class="text-sm text-gray-500">Page {{ pagination.page }} of {{ pagination.totalPages }}</p>
        <div class="flex gap-2">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
          <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages" class="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <EventModal
      v-if="showModal"
      :event="editTarget"
      @close="showModal = false"
      @saved="handleSaved"
    />

    <!-- Delete Confirm -->
    <ConfirmDialog
      v-if="deleteTarget"
      title="Delete Event?"
      :message="`This will permanently delete &quot;${deleteTarget.name}&quot; and all its bookings.`"
      confirm-text="Delete"
      icon="🗑️"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToastStore } from '../stores/toastStore'
import { eventService } from '../services/eventService'
import { bookingService } from '../services/bookingService'
import EventModal from '../components/ui/EventModal.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const toast = useToastStore()
const events = ref([])
const loading = ref(true)
const exporting = ref(false)
const showModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)
const deleting = ref(false)
const pagination = ref({ page: 1, total: 0, totalPages: 1 })

const availableEvents = computed(() => events.value.filter(e => e.availableSeats > 0).length)
const soldOutEvents = computed(() => events.value.filter(e => e.availableSeats === 0).length)
const totalSeatsBooked = computed(() => events.value.reduce((acc, e) => acc + (e.capacity - e.availableSeats), 0))

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'

const fetchEvents = async () => {
  loading.value = true
  try {
    const res = await eventService.getAll({ page: pagination.value.page, limit: 10 })
    events.value = res.data.events
    pagination.value = { page: res.data.page, total: res.data.total, totalPages: res.data.totalPages }
  } catch {
    toast.error('Failed to load events')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => { pagination.value.page = page; fetchEvents() }

const openCreate = () => { editTarget.value = null; showModal.value = true }
const openEdit = (event) => { editTarget.value = event; showModal.value = true }

const handleSaved = (savedEvent) => {
  showModal.value = false
  toast.success(editTarget.value ? 'Event updated!' : 'Event created!')
  fetchEvents()
}

const confirmDelete = (event) => { deleteTarget.value = event }

const handleDelete = async () => {
  deleting.value = true
  try {
    await eventService.remove(deleteTarget.value._id)
    toast.success('Event deleted')
    deleteTarget.value = null
    fetchEvents()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Delete failed')
  } finally {
    deleting.value = false
  }
}

const handleExport = async () => {
  exporting.value = true
  try {
    await bookingService.exportCSV()
    toast.success('Bookings exported successfully!')
  } catch {
    toast.error('Export failed')
  } finally {
    exporting.value = false
  }
}

onMounted(fetchEvents)
</script>
