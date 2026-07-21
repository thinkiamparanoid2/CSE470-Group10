<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';

const props = defineProps({
    milestones: {
        type: Array,
        required: true,
    },
    canManage: {
        type: Boolean,
        required: true,
    },
});

// Modals
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedMilestone = ref(null);

// Forms
const createForm = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
    color: '#3b82f6',
});

const editForm = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
    color: '#3b82f6',
});

const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Purple', value: '#8b5cf6' },
];

const openEditModal = (milestone) => {
    selectedMilestone.value = milestone;
    editForm.title = milestone.title;
    editForm.description = milestone.description;
    editForm.start_date = milestone.start_date;
    editForm.end_date = milestone.end_date;
    editForm.status = milestone.status;
    editForm.color = milestone.color;
    isEditModalOpen.value = true;
};

const submitCreate = () => {
    createForm.post(route('milestones.store'), {
        onSuccess: () => {
            isCreateModalOpen.value = false;
            createForm.reset();
            renderCalendar();
        }
    });
};

const submitEdit = () => {
    editForm.patch(route('milestones.update', selectedMilestone.value.id), {
        onSuccess: () => {
            isEditModalOpen.value = false;
            selectedMilestone.value = null;
            renderCalendar();
        }
    });
};

const deleteMilestone = (id) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
        useForm({}).delete(route('milestones.destroy', id), {
            onSuccess: () => renderCalendar()
        });
    }
};

let calendarInstance = null;

const renderCalendar = () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl || !window.FullCalendar) return;

    if (calendarInstance) {
        calendarInstance.destroy();
    }

    calendarInstance = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        themeSystem: 'standard',
        events: props.milestones.map(m => ({
            id: m.id,
            title: m.title,
            start: m.start_date,
            end: m.end_date ? m.end_date + 'T23:59:59' : null,
            color: m.color,
            extendedProps: {
                description: m.description,
                status: m.status
            }
        })),
        eventClick: (info) => {
            const milestone = props.milestones.find(m => m.id == info.event.id);
            if (milestone) {
                openEditModal(milestone);
            }
        }
    });
    calendarInstance.render();
};

onMounted(() => {
    if (!window.FullCalendar) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js';
        script.onload = () => {
            renderCalendar();
        };
        document.head.appendChild(script);
    } else {
        renderCalendar();
    }
});
</script>

<template>
    <Head title="Milestones Calendar" />

    <AuthenticatedLayout>
        <template #header>
            Milestone & Phase Tracker
        </template>

        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 class="text-base font-bold text-white">Construction Schedule & Phase Milestones</h2>
                    <p class="text-slate-400 text-xs mt-0.5">Map structural phases (Piling, Slab Casting, MEP Rough-In, Finishing) on interactive calendar timelines.</p>
                </div>
                <button
                    v-if="canManage"
                    @click="isCreateModalOpen = true"
                    class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Milestone
                </button>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- Calendar (Left) -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-8">
                    <div id="calendar" class="fc-clean-theme min-h-[500px]"></div>
                </div>

                <!-- Milestone List Panel (Right) -->
                <div class="space-y-4 lg:col-span-4">
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h3 class="font-bold text-white text-xs uppercase tracking-wider">Scheduled Project Phases</h3>
                        <p class="text-[11px] text-slate-400 mt-1">Click any card or calendar item to inspect or update phase details.</p>
                    </div>

                    <div v-if="milestones.length > 0" class="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                        <div
                            v-for="milestone in milestones"
                            :key="milestone.id"
                            class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer relative overflow-hidden"
                            @click="openEditModal(milestone)"
                        >
                            <!-- Color Accent Bar -->
                            <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: milestone.color }"></div>

                            <div class="space-y-2 pl-2">
                                <div class="flex items-start justify-between gap-3">
                                    <h4 class="font-bold text-white text-xs truncate">{{ milestone.title }}</h4>
                                    <span
                                        class="px-2 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0"
                                        :style="{
                                            color: milestone.color,
                                            borderColor: milestone.color + '40',
                                            backgroundColor: milestone.color + '15'
                                        }"
                                    >
                                        {{ milestone.status }}
                                    </span>
                                </div>
                                
                                <p class="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                                    {{ milestone.description || 'No description provided.' }}
                                </p>

                                <div class="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400 font-semibold">
                                    <span>Start: {{ milestone.start_date }}</span>
                                    <span>End: {{ milestone.end_date }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-12 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl font-semibold">
                        No milestones created yet.
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Milestone Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-sm font-bold text-white">Create Construction Milestone</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-1.5">Milestone Title</label>
                        <input v-model="createForm.title" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. Ground Floor Column & Slab Casting" />
                    </div>

                    <div>
                        <label class="block text-slate-300 mb-1.5">Description & Scope</label>
                        <textarea v-model="createForm.description" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="Details regarding concrete mix, rebar specs, and labor allocation..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Start Date</label>
                            <input v-model="createForm.start_date" required type="date" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">End Date</label>
                            <input v-model="createForm.end_date" required type="date" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Status</label>
                            <select v-model="createForm.status" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:border-blue-500 outline-none cursor-pointer">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Accent Color</label>
                            <select v-model="createForm.color" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:border-blue-500 outline-none cursor-pointer">
                                <option v-for="color in colors" :key="color.value" :value="color.value">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="isCreateModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Create Milestone</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit/Delete Milestone Modal -->
        <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-sm font-bold text-white">Update Milestone Phase</h3>
                    <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitEdit" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-1.5">Milestone Title</label>
                        <input v-model="editForm.title" :disabled="!canManage" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 disabled:opacity-50 focus:border-blue-500 outline-none" />
                    </div>

                    <div>
                        <label class="block text-slate-300 mb-1.5">Description</label>
                        <textarea v-model="editForm.description" :disabled="!canManage" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 disabled:opacity-50 focus:border-blue-500 outline-none"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Start Date</label>
                            <input v-model="editForm.start_date" :disabled="!canManage" required type="date" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 disabled:opacity-50 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">End Date</label>
                            <input v-model="editForm.end_date" :disabled="!canManage" required type="date" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 disabled:opacity-50 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Status</label>
                            <select v-model="editForm.status" :disabled="!canManage" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 disabled:opacity-50 focus:border-blue-500 outline-none cursor-pointer">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Accent Color</label>
                            <select v-model="editForm.color" :disabled="!canManage" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 disabled:opacity-50 focus:border-blue-500 outline-none cursor-pointer">
                                <option v-for="color in colors" :key="color.value" :value="color.value">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-between border-t border-slate-800 gap-4">
                        <button
                            v-if="canManage"
                            type="button"
                            @click="deleteMilestone(selectedMilestone.id)"
                            class="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20 transition-colors"
                        >
                            Delete Phase
                        </button>
                        <div v-else></div>

                        <div class="flex items-center gap-3">
                            <button type="button" @click="isEditModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Close</button>
                            <button v-if="canManage" type="submit" :disabled="editForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style>
/* Clean FullCalendar dark theme styling */
.fc-clean-theme .fc-theme-standard td, 
.fc-clean-theme .fc-theme-standard th,
.fc-clean-theme .fc-theme-standard .fc-scrollgrid {
    border-color: #334155 !important;
}

.fc-clean-theme .fc-col-header-cell {
    background-color: #0f172a !important; 
    padding: 10px 0 !important;
}

.fc-clean-theme .fc-col-header-cell-cushion {
    color: #94a3b8 !important; 
    font-size: 11px !important;
    text-transform: uppercase !important;
    font-weight: 700 !important;
}

.fc-clean-theme .fc-daygrid-day-number {
    color: #cbd5e1 !important; 
    font-size: 0.8125rem !important;
    font-weight: 700 !important;
    padding: 6px !important;
}

.fc-clean-theme .fc-daygrid-day:hover {
    background-color: rgba(51, 65, 85, 0.3) !important;
}

.fc-clean-theme .fc-day-today {
    background-color: rgba(37, 99, 235, 0.15) !important;
}

.fc-clean-theme .fc-button {
    background-color: #1e293b !important; 
    border-color: #334155 !important; 
    color: #e2e8f0 !important; 
    font-weight: 700 !important;
    font-size: 11px !important;
    border-radius: 0.5rem !important;
    padding: 6px 12px !important;
}

.fc-clean-theme .fc-button:hover {
    background-color: #334155 !important;
    color: #ffffff !important;
}

.fc-clean-theme .fc-button-active {
    background-color: #2563eb !important; 
    color: #ffffff !important; 
    border-color: #2563eb !important;
}

.fc-clean-theme .fc-toolbar-title {
    color: #ffffff !important;
    font-size: 1rem !important;
    font-weight: 700;
}

.fc-clean-theme .fc-event {
    border-radius: 4px !important;
    padding: 2px 4px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
}
</style>
