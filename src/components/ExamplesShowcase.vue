<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      title="Component Examples"
      eyebrow="Reference"
      description="A living catalog of every base component in this template."
    />

    <!-- Buttons -->
    <Card title="Buttons" description="Variants and sizes">
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline-danger">Outline Danger</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="primary" size="xs">XS</Button>
        <Button variant="primary" size="sm">SM</Button>
        <Button variant="primary" size="md">MD</Button>
        <Button variant="primary" size="lg">LG</Button>
      </div>
    </Card>

    <!-- Badges -->
    <Card title="Badges" description="Status labels">
      <div class="flex flex-wrap items-center gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning" dot>Pending</Badge>
        <Badge variant="danger" dot>Failed</Badge>
      </div>
    </Card>

    <!-- Cards -->
    <Card title="Cards" description="Container variants: bordered, shadow, padding and slots">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card title="Bordered" description="Default style">
          <p class="text-sm text-zinc-500">Plain border, no shadow. The default look.</p>
        </Card>

        <Card title="Shadow" description="shadow prop" shadow>
          <p class="text-sm text-zinc-500">Elevated with a soft shadow instead of a border.</p>
        </Card>

        <Card>
          <template #header>
            <div class="flex w-full items-center justify-between">
              <p class="text-sm font-semibold text-zinc-800">Custom header slot</p>
              <Badge variant="success" dot>Live</Badge>
            </div>
          </template>
          <p class="text-sm text-zinc-500">Use the header slot to place anything, like a badge or action button.</p>
        </Card>

        <Card title="With footer" description="Footer slot for actions">
          <p class="text-sm text-zinc-500">Common for confirmation or edit forms inside a card.</p>
          <template #footer>
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </template>
        </Card>
      </div>

      <Divider class="my-5">Unpadded content</Divider>

      <Card :padded="false" shadow>
        <ul class="divide-y divide-zinc-100">
          <li v-for="item in cardListItems" :key="item.label" class="flex items-center justify-between px-5 py-3">
            <span class="text-sm text-zinc-700">{{ item.label }}</span>
            <span class="text-sm font-medium text-zinc-900">{{ item.value }}</span>
          </li>
        </ul>
      </Card>

      <Divider class="my-5">Stat cards</Divider>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card v-for="stat in statCards" :key="stat.label">
          <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">{{ stat.label }}</p>
          <p class="mt-1 text-2xl font-bold text-zinc-900">{{ stat.value }}</p>
          <Badge class="mt-2" :variant="stat.trend === 'up' ? 'success' : 'danger'">
            {{ stat.trend === 'up' ? '▲' : '▼' }} {{ stat.change }}
          </Badge>
        </Card>
      </div>

      <Divider class="my-5">Media &amp; images</Divider>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <!-- Cover image (banner) -->
        <Card :padded="false" shadow>
          <ImagePlaceholder class="aspect-[16/9] rounded-t-xl" icon-class="size-8" />
          <div class="p-5">
            <p class="text-sm font-semibold text-zinc-800">Cover image</p>
            <p class="mt-0.5 text-xs text-zinc-500">Full-width banner, 16:9, on an unpadded card.</p>
            <div class="mt-3 flex items-center gap-2">
              <Badge variant="primary">Vehicle</Badge>
              <Badge>Sedan</Badge>
            </div>
          </div>
        </Card>

        <!-- Horizontal thumbnail -->
        <Card>
          <div class="flex gap-4">
            <ImagePlaceholder class="size-20 shrink-0 rounded-lg" icon-class="size-6" />
            <div class="flex flex-col justify-center gap-1">
              <p class="text-sm font-semibold text-zinc-800">Thumbnail</p>
              <p class="text-xs text-zinc-500">Fixed square image beside content, like a list preview.</p>
              <Badge class="w-fit" variant="success" dot>In stock</Badge>
            </div>
          </div>
        </Card>

        <!-- Avatar profile -->
        <Card>
          <div class="flex flex-col items-center gap-2 text-center">
            <ImagePlaceholder class="size-16 rounded-full" icon-class="size-6" />
            <p class="text-sm font-semibold text-zinc-800">Avatar</p>
            <p class="text-xs text-zinc-500">Small circular image, e.g. a user or contact card.</p>
            <Badge variant="primary">Technician</Badge>
          </div>
        </Card>

        <!-- Gallery grid -->
        <Card title="Gallery" description="Uniform thumbnail grid">
          <div class="grid grid-cols-3 gap-1.5">
            <ImagePlaceholder v-for="n in 6" :key="n" class="aspect-square rounded-md" icon-class="size-4" />
          </div>
        </Card>
      </div>
    </Card>

    <!-- Form controls -->
    <Card title="Form Controls" description="Inputs, selects, dates and toggles">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input v-model="form.name" label="Name" placeholder="Jane Doe" />
        <Input v-model="form.email" label="Email" type="email" placeholder="jane@company.com" error="This field is required" />
        <PhoneInput v-model="form.phone" v-model:country-code="form.phoneCountry" label="Mobile" />
        <SearchInput v-model="form.search" placeholder="Search customers..." />
        <Select v-model="form.status" label="Status" placeholder="Select a status" :options="statusOptions" />
        <DatePicker v-model="form.date" label="Due date" hint="Business days only" />
        <Textarea v-model="form.notes" label="Notes" placeholder="Add any notes..." :max-length="200" />
      </div>

      <Divider class="my-5">Toggles &amp; Choices</Divider>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-3">
          <Checkbox v-model="form.subscribe" description="Get notified about updates">
            Subscribe to newsletter
          </Checkbox>
          <Toggle v-model="form.enabled" description="Enable this record">
            Active
          </Toggle>
        </div>

        <RadioGroup
          v-model="form.priority"
          name="priority"
          label="Priority"
          direction="horizontal"
          :options="priorityOptions"
        />
      </div>
    </Card>

    <!-- Tabs -->
    <Card title="Tabs" description="Underline and pill variants">
      <Tabs v-model="activeTab" :tabs="tabItems" variant="underline">
        <template #default="{ activeId }">
          <p class="text-sm text-zinc-500">Active tab: <span class="font-medium text-zinc-700">{{ activeId }}</span></p>
        </template>
      </Tabs>

      <Divider class="my-5" />

      <Tabs v-model="activePillTab" :tabs="tabItems" variant="pills" />
    </Card>

    <!-- Feedback -->
    <Card title="Feedback" description="Toasts, tooltips and loaders">
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="secondary" @click="toast.success('Saved', 'Record updated successfully')">Trigger success toast</Button>
        <Button variant="secondary" @click="toast.error('Something went wrong', 'Please try again')">Trigger error toast</Button>
        <Button variant="secondary" @click="toast.warning('Heads up', 'This action is irreversible')">Trigger warning toast</Button>
        <Button variant="secondary" @click="toast.info('FYI', 'Sync runs every 15 minutes')">Trigger info toast</Button>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-6">
        <Tooltip text="Top tooltip" position="top">
          <Button variant="ghost" size="sm">Hover me (top)</Button>
        </Tooltip>
        <Tooltip text="Right tooltip" position="right">
          <Button variant="ghost" size="sm">Hover me (right)</Button>
        </Tooltip>
      </div>

      <div class="mt-5">
        <Button variant="secondary" @click="showLoader">Show full-screen loader (1.5s)</Button>
        <Loader :visible="loading" />
      </div>
    </Card>

    <!-- Modal -->
    <Card title="Modal" description="Teleported dialog with header/body/footer slots">
      <Button variant="primary" @click="showModal = true">Open modal</Button>

      <Modal v-model="showModal" title="Confirm action" size="sm">
        <p class="text-sm text-zinc-600">Are you sure you want to proceed? This cannot be undone.</p>

        <template #footer>
          <Button variant="secondary" size="sm" @click="showModal = false">Cancel</Button>
          <Button variant="danger" size="sm" @click="confirmModal">Confirm</Button>
        </template>
      </Modal>
    </Card>

    <!-- Empty state -->
    <Card title="Empty State" description="Placeholder for lists with no data">
      <EmptyState title="No records found" description="Try adjusting your filters or create a new record.">
        <template #action>
          <Button variant="primary" size="sm">Create record</Button>
        </template>
      </EmptyState>
    </Card>

    <!-- Table -->
    <Card title="Table" description="Sortable columns, custom cell slots, loading and empty states">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" @click="tableLoading = !tableLoading">
          {{ tableLoading ? 'Stop loading' : 'Simulate loading' }}
        </Button>
        <Button variant="secondary" size="sm" @click="tableEmpty = !tableEmpty">
          {{ tableEmpty ? 'Show rows' : 'Show empty state' }}
        </Button>
      </div>

      <Table
        :columns="tableColumns"
        :rows="tableEmpty ? [] : tableRows"
        :loading="tableLoading"
        row-key="id"
        clickable-rows
        empty-title="No customers found"
        empty-description="Try adjusting your filters or create a new customer."
        @row-click="onTableRowClick"
      >
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value as string)" dot>{{ value }}</Badge>
        </template>
      </Table>
    </Card>

    <!-- Pagination -->
    <Card title="Pagination" description="Page through a result set">
      <Pagination v-model="page" :total-items="devTotalItems" :page-size="pageSize" />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

import PageHeader from '@/components/main/PageHeader.vue'
import Card from '@/components/main/Card.vue'
import Divider from '@/components/main/Divider.vue'
import Tabs, { type Tab } from '@/components/main/Tabs.vue'
import Tooltip from '@/components/main/Tooltip.vue'
import Loader from '@/components/main/Loader.vue'
import Modal from '@/components/main/Modal.vue'
import EmptyState from '@/components/main/EmptyState.vue'
import Badge from '@/components/main/Badge.vue'
import Pagination from '@/components/main/Pagination.vue'
import Table, { type TableColumn } from '@/components/main/Table.vue'
import ImagePlaceholder from '@/components/main/ImagePlaceholder.vue'

import Button from '@/components/buttons/Button.vue'

import Input from '@/components/form/Input.vue'
import SearchInput from '@/components/form/SearchInput.vue'
import Select, { type SelectOption } from '@/components/form/Select.vue'
import PhoneInput from '@/components/form/PhoneInput.vue'
import DatePicker from '@/components/form/DatePicker.vue'
import Textarea from '@/components/form/Textarea.vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Toggle from '@/components/form/Toggle.vue'
import RadioGroup, { type RadioOption } from '@/components/form/RadioGroup.vue'

const toast = useToast()

const form = ref({
  name: '',
  email: '',
  phone: '',
  phoneCountry: 'US',
  search: '',
  status: '',
  date: '',
  notes: '',
  subscribe: true,
  enabled: false,
  priority: 'medium' as string | number,
})

const statusOptions: SelectOption[] = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Closed', value: 'closed' },
]

const priorityOptions: RadioOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const tabItems: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity', badge: 3 },
  { id: 'settings', label: 'Settings' },
]
const activeTab = ref('overview')
const activePillTab = ref('overview')

const loading = ref(false)
function showLoader() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}

const showModal = ref(false)
function confirmModal() {
  showModal.value = false
  toast.success('Confirmed', 'Action completed')
}

const page = ref(1)
const pageSize = 10
const devTotalItems = 42

const cardListItems = [
  { label: 'Plan', value: 'Pro' },
  { label: 'Seats', value: '12 / 20' },
  { label: 'Renews on', value: 'Oct 1, 2026' },
]

const statCards = [
  { label: 'Open Work Orders', value: '24', trend: 'up' as const, change: '8%' },
  { label: 'Avg. Resolution', value: '3.2d', trend: 'down' as const, change: '12%' },
  { label: 'Customer Rating', value: '4.8', trend: 'up' as const, change: '2%' },
]

const tableColumns: TableColumn[] = [
  { key: 'name', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', align: 'right' },
]

const tableRows = [
  { id: '1', name: 'Jane Cooper', email: 'jane.cooper@company.com', status: 'active', amount: '$1,250.00' },
  { id: '2', name: 'Wade Warren', email: 'wade.warren@company.com', status: 'pending', amount: '$860.00' },
  { id: '3', name: 'Esther Howard', email: 'esther.howard@company.com', status: 'failed', amount: '$430.00' },
  { id: '4', name: 'Cameron Williamson', email: 'cameron.w@company.com', status: 'active', amount: '$2,140.00' },
]

const tableLoading = ref(false)
const tableEmpty = ref(false)

function statusVariant(status: string) {
  if (status === 'active') return 'success'
  if (status === 'pending') return 'warning'
  return 'danger'
}

function onTableRowClick(row: Record<string, unknown>) {
  toast.info('Row clicked', String(row.name))
}
</script>
