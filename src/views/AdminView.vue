<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Header -->
    <div class="flex items-center justify-between mb-10 flex-wrap gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 mb-3" style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);">
          ⚙️ Admin Panel
        </div>
        <h1 class="text-4xl font-black text-white">Event Management</h1>
        <p class="text-white/40 mt-1">Create, manage, and export event data</p>
      </div>
      <div class="flex gap-3">
        <button @click="handleExport" :disabled="exporting" class="btn-secondary flex items-center gap-2 px-5">
          {{ exporting ? '⏳ Exporting…' : '📥 Export CSV' }}
        </button>
        <button @click="openCreate" class="btn-primary flex items-center gap-2 px-5">
          ＋ New Event
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <div class="card text-center" v-for="stat in stats" :key="stat.label">
        <p class="text-3xl font-black mb-1" :class="stat.color">{{ stat.value }}</p>
        <p class="text-xs text-white/40 font-medium uppercase tracking-wide">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card p-0 overflow-hidden">
      <div class="p-6 flex flex-col gap-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="skeleton h-4 rounded flex-1"></div>
          <div class="skeleton h-4 rounded w-24"></div>
          <div class="skeleton h-4 rounded w-16"></div>
          <div class="skeleton h-8 rounded-lg w-24"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!events.length" class="text-center py-24">
      <div class="text-5xl mb-4">📋</div>
      <p class="text-white/40 text-lg">No events yet</p>
      <button @click="openCreate" class="btn-primary mt-6 px-8">Create First Event</button>
    </div>

    <!-- Table -->
    <div v-else class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);">
              <th class="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Event</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Date</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Capacity</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Available</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              <th class="text-right px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in events" :key="event._id"
              class="transition-colors duration-150 group"
              style="border-bottom: 1px solid rgba(255,255,255,0.04);"
              :style="{ background: 'transparent' }"
              @mouseenter="e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'"
              @mouseleave="e => e.currentTarget.style.background = 'transparent'"
            >
              <td class="px-6 py-4 font-semibold text-white max-w-xs truncate">{{ event.name }}</td>
              <td class="px-6 py-4 text-white/50">{{ formatDate(event.date) }}</td>
              <td class="px-6 py-4 text-white/50">{{ event.capacity }}</td>
              <td class="px-6 py-4 font-bold" :class="event.availableSeats === 0 ? 'text-red-400' : 'text-emerald-400'">
                {{ event.availableSeats }}
              </td>
              <td class="px-6 py-4">
                <span :class="event.availableSeats === 0 ? 'badge-danger' : event.availableSeats <= 10 ? 'badge-warning' : 'badge-success'">
                  {{ event.availableSeats === 0 ? 'Sold Out' : event.availableSeats <= 10 ? 'Few Left' : 'Available' }}
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

      <!-- Table Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between px-6 py-4" style="border-top: 1px solid rgba(255,255,255,0.06);">
        <p class="text-xs text-white/30">Page {{ pagination.page }} of {{ pagination.totalPages }}</p>
        <div class="flex gap-2">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30">← Prev</button>
          <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages" class="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30">Next →</button>
        </div>
      </div>
    </div>

    <EventModal v-if="showModal" :event="editTarget" @close="showModal = false" @saved="handleSaved" />
    <ConfirmDialog
      v-if="deleteTarget"
      title="Delete Event?"
      :message="`Permanently delete &quot;${deleteTarget.name}&quot;?`"
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

const stats = computed(() => [
  { label: 'Total Events', value: pagination.value.total || 0, color: 'text-indigo-400' },
  { label: 'Available',    value: events.value.filter(e => e.availableSeats > 0).length, color: 'text-emerald-400' },
  { label: 'Sold Out',     value: events.value.filter(e => e.availableSeats === 0).length, color: 'text-red-400' },
  { label: 'Seats Booked', value: events.value.reduce((a, e) => a + (e.capacity - e.availableSeats), 0), color: 'text-amber-400' },
])

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'

const fetchEvents = async () => {
  loading.value = true
  try {
    const res = await eventService.getAll({ page: pagination.value.page, limit: 10 })
    events.value = res.data.events
    pagination.value = { page: res.data.page, total: res.data.total, totalPages: res.data.totalPages }
  } catch { toast.error('Failed to load events') }
  finally { loading.value = false }
}

const changePage = (p) => { pagination.value.page = p; fetchEvents() }
const openCreate = () => { editTarget.value = null; showModal.value = true }
const openEdit = (e) => { editTarget.value = e; showModal.value = true }
const handleSaved = () => { showModal.value = false; toast.success(editTarget.value ? 'Event updated!' : 'Event created!'); fetchEvents() }
const confirmDelete = (e) => { deleteTarget.value = e }

const handleDelete = async () => {
  deleting.value = true
  try {
    await eventService.remove(deleteTarget.value._id)
    toast.success('Event deleted')
    deleteTarget.value = null
    fetchEvents()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Delete failed')
  } finally { deleting.value = false }
}

const handleExport = async () => {
  exporting.value = true
  try { await bookingService.exportCSV(); toast.success('CSV exported!') }
  catch { toast.error('Export failed') }
  finally { exporting.value = false }
}

onMounted(fetchEvents)
</script>
