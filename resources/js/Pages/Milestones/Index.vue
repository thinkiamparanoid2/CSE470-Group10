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
    color: '#2563eb',
});

const editForm = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
    color: '#2563eb',
});

const colors = [
    { name: 'Royal Blue', value: '#2563eb' },
    { name: 'Emerald Green', value: '#059669' },
    { name: 'Indigo Purple', value: '#4f46e5' },
    { name: 'Amber Gold', value: '#d97706' },
    { name: 'Crimson Red', value: '#dc2626' },
    { name: 'Deep Teal', value: '#0d9488' },
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
            Milestone & Schedule Tracker
        </template>

        <div class="space-y-6 sm:space-y-8">
            <!-- Header Section -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div class="lg:col-span-8 space-y-2 relative z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                        Structural Timeline
                    </div>
                    <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Construction Schedule & Phase Milestones</h2>
                    <p class="text-blue-100 text-xs sm:text-sm font-medium">Visualize construction phases (Piling, Slab Casting, Masonry, MEP Rough-In), schedule deadlines, and monitor completion metrics.</p>
                </div>

                <div class="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 relative z-10">
                    <button
                        v-if="canManage"
                        @click="isCreateModalOpen = true"
                        class="px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold tracking-wide transition-all shadow-md hover:scale-105 flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        New Milestone
                    </button>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                <!-- Calendar (Left) -->
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-8">
                    <div id="calendar" class="fc-light-theme min-h-[520px]"></div>
                </div>

                <!-- Milestone List Panel (Right) -->
                <div class="space-y-4 lg:col-span-4">
                    <div class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                        <h3 class="font-extrabold text-slate-900 text-xs uppercase tracking-widest">Scheduled Structural Phases</h3>
                        <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Click any milestone card or calendar block to inspect configuration details.</p>
                    </div>

                    <div v-if="milestones.length > 0" class="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                        <div
                            v-for="milestone in milestones"
                            :key="milestone.id"
                            class="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-md"
                            @click="openEditModal(milestone)"
                        >
                            <!-- Color Accent Bar -->
                            <div class="absolute left-0 top-0 bottom-0 w-1.5" :style="{ backgroundColor: milestone.color }"></div>

                            <div class="space-y-3 pl-2">
                                <div class="flex items-start justify-between gap-3">
                                    <h4 class="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-blue-600 transition-colors truncate">{{ milestone.title }}</h4>
                                    <span
                                        class="px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase border shrink-0"
                                        :style="{
                                            color: milestone.color,
                                            borderColor: milestone.color + '40',
                                            backgroundColor: milestone.color + '15'
                                        }"
                                    >
                                        {{ milestone.status }}
                                    </span>
                                </div>
                                
                                <p class="text-slate-500 text-[11px] font-medium line-clamp-2 leading-relaxed">
                                    {{ milestone.description || 'No description provided.' }}
                                </p>

                                <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    <span>From: {{ milestone.start_date }}</span>
                                    <span>To: {{ milestone.end_date }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-16 text-center text-xs text-slate-400 bg-white border border-slate-200/80 rounded-3xl font-extrabold uppercase tracking-widest">
                        No milestones created yet.
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Milestone Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Schedule Construction Milestone</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-2">Milestone Title</label>
                        <input v-model="createForm.title" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. 1st to 5th Floor Column & Slab Casting" />
                    </div>

                    <div>
                        <label class="block text-slate-700 mb-2">Description & Operational Scope</label>
                        <textarea v-model="createForm.description" rows="3" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="Details regarding concrete specs, rebar tying, and formwork..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Start Date</label>
                            <input v-model="createForm.start_date" required type="date" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">End Date</label>
                            <input v-model="createForm.end_date" required type="date" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Phase Status</label>
                            <select v-model="createForm.status" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-700 focus:border-blue-600 outline-none transition-all cursor-pointer">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Label Accent Color</label>
                            <select v-model="createForm.color" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-700 focus:border-blue-600 outline-none transition-all cursor-pointer">
                                <option v-for="color in colors" :key="color.value" :value="color.value">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" @click="isCreateModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Create Milestone</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit/Delete Milestone Modal -->
        <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Update Milestone Phase</h3>
                    <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitEdit" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-2">Milestone Title</label>
                        <input v-model="editForm.title" :disabled="!canManage" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 disabled:opacity-50 focus:border-blue-600 outline-none transition-all" />
                    </div>

                    <div>
                        <label class="block text-slate-700 mb-2">Description</label>
                        <textarea v-model="editForm.description" :disabled="!canManage" rows="3" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 disabled:opacity-50 focus:border-blue-600 outline-none transition-all"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Start Date</label>
                            <input v-model="editForm.start_date" :disabled="!canManage" required type="date" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 disabled:opacity-50 focus:border-blue-600 outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">End Date</label>
                            <input v-model="editForm.end_date" :disabled="!canManage" required type="date" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 disabled:opacity-50 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Phase Status</label>
                            <select v-model="editForm.status" :disabled="!canManage" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-700 disabled:opacity-50 focus:border-blue-600 outline-none transition-all cursor-pointer">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Label Accent Color</label>
                            <select v-model="editForm.color" :disabled="!canManage" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-700 disabled:opacity-50 focus:border-blue-600 outline-none transition-all cursor-pointer">
                                <option v-for="color in colors" :key="color.value" :value="color.value">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-6 flex items-center justify-between border-t border-slate-100 gap-4">
                        <button
                            v-if="canManage"
                            type="button"
                            @click="deleteMilestone(selectedMilestone.id)"
                            class="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 transition-all uppercase tracking-wider text-[11px]"
                        >
                            Delete Phase
                        </button>
                        <div v-else></div>

                        <div class="flex items-center gap-3">
                            <button type="button" @click="isEditModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Close</button>
                            <button v-if="canManage" type="submit" :disabled="editForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style>
/* Clean FullCalendar light theme styling */
.fc-light-theme .fc-theme-standard td, 
.fc-light-theme .fc-theme-standard th,
.fc-light-theme .fc-theme-standard .fc-scrollgrid {
    border-color: #e2e8f0 !important;
}

.fc-light-theme .fc-col-header-cell {
    background-color: #f8fafc !important; 
    padding: 12px 0 !important;
}

.fc-light-theme .fc-col-header-cell-cushion {
    color: #64748b !important; 
    font-size: 10px !important;
    text-transform: uppercase !important;
    font-weight: 800 !important;
    letter-spacing: 0.05em !important;
}

.fc-light-theme .fc-daygrid-day-number {
    color: #334155 !important; 
    font-size: 0.8125rem !important;
    font-weight: 700 !important;
    padding: 8px !important;
}

.fc-light-theme .fc-daygrid-day:hover {
    background-color: #f1f5f9 !important;
}

.fc-light-theme .fc-day-today {
    background-color: #eff6ff !important;
}

.fc-light-theme .fc-button {
    background-color: #ffffff !important; 
    border-color: #cbd5e1 !important; 
    color: #334155 !important; 
    font-weight: 700 !important;
    font-size: 11px !important;
    border-radius: 0.75rem !important;
    padding: 8px 14px !important;
    transition: all 0.2s !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.fc-light-theme .fc-button:hover {
    background-color: #f8fafc !important;
    color: #0f172a !important;
}

.fc-light-theme .fc-button-active {
    background-color: #2563eb !important; 
    color: #ffffff !important; 
    border-color: #2563eb !important;
}

.fc-light-theme .fc-toolbar-title {
    color: #0f172a !important;
    font-size: 1.125rem !important;
    font-weight: 800;
}

.fc-light-theme .fc-event {
    border-radius: 6px !important;
    padding: 3px 6px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
}
</style>
