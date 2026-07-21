<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    stats: {
        type: Object,
        required: true,
    },
    lowStockMaterials: {
        type: Array,
        required: true,
    },
    upcomingMilestones: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <Head title="Overview Console" />

    <AuthenticatedLayout>
        <template #header>
            Executive Dashboard
        </template>

        <div class="space-y-6">
            <!-- Welcome Alert Banner -->
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm">
                <div class="space-y-1">
                    <h2 class="text-xl font-bold text-white">Welcome back, {{ $page.props.auth.user.name }}</h2>
                    <p class="text-slate-400 text-xs">Real-time site inventory, active vendor directories, and construction milestones monitoring.</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Site Operational
                    </span>
                </div>
            </div>

            <!-- Essential KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <!-- Total Materials Card -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cataloged Resources</span>
                        <div class="text-2xl font-extrabold text-white mt-1">{{ stats.totalMaterials }} <span class="text-xs font-normal text-slate-400">Items</span></div>
                    </div>
                    <div class="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                </div>

                <!-- Low Stock Items Card -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Stock Warnings</span>
                        <div class="text-2xl font-extrabold mt-1" :class="stats.lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'">
                            {{ stats.lowStockCount }} <span class="text-xs font-normal text-slate-400">Items Low</span>
                        </div>
                    </div>
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center border" :class="stats.lowStockCount > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <!-- Total Vendors Card -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Suppliers</span>
                        <div class="text-2xl font-extrabold text-white mt-1">{{ stats.totalVendors }} <span class="text-xs font-normal text-slate-400">Firms</span></div>
                    </div>
                    <div class="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Active Milestones Card -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Phases</span>
                        <div class="text-2xl font-extrabold text-white mt-1">{{ stats.activeMilestonesCount }} <span class="text-xs font-normal text-slate-400">Scheduled</span></div>
                    </div>
                    <div class="w-10 h-10 bg-teal-600/10 rounded-xl flex items-center justify-center text-teal-400 border border-teal-500/20">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Decision & Operations Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Critical Stock Inventory (Left) -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-6 flex flex-col space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-sm font-bold text-white">Stock Warnings & Reorder Alerts</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Inventory items below safety threshold levels</p>
                        </div>
                        <Link :href="route('materials.index')" class="text-xs font-semibold text-blue-400 hover:text-blue-300">
                            View All Inventory &rarr;
                        </Link>
                    </div>

                    <div v-if="lowStockMaterials.length > 0" class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300">
                            <thead>
                                <tr class="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                                    <th class="pb-3">Material Name</th>
                                    <th class="pb-3 text-right">Stock</th>
                                    <th class="pb-3 text-right">Reorder Level</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60">
                                <tr v-for="material in lowStockMaterials" :key="material.id" class="hover:bg-slate-800/40">
                                    <td class="py-3 font-semibold text-white flex items-center gap-2">
                                        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                                        {{ material.name }}
                                    </td>
                                    <td class="py-3 text-right font-bold text-rose-400">
                                        {{ material.quantity }} <span class="text-[10px] text-slate-400 font-normal uppercase">{{ material.unit }}</span>
                                    </td>
                                    <td class="py-3 text-right text-slate-400">
                                        {{ material.reorder_level }} <span class="text-[10px] uppercase">{{ material.unit }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="py-12 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                        <svg class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs font-semibold text-slate-300">All inventory items are sufficiently stocked.</span>
                    </div>
                </div>

                <!-- Milestone Schedule Timeline (Right) -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-6 flex flex-col space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-sm font-bold text-white">Project Milestones & Phases</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Upcoming structural phases and schedule deadlines</p>
                        </div>
                        <Link :href="route('milestones.index')" class="text-xs font-semibold text-blue-400 hover:text-blue-300">
                            Open Calendar &rarr;
                        </Link>
                    </div>

                    <div v-if="upcomingMilestones.length > 0" class="space-y-3">
                        <div v-for="milestone in upcomingMilestones" :key="milestone.id" class="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
                            <div class="space-y-1 min-w-0">
                                <div class="font-bold text-white text-xs truncate">{{ milestone.title }}</div>
                                <div class="text-[11px] text-slate-400 flex items-center gap-2">
                                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    {{ milestone.start_date }} &mdash; {{ milestone.end_date }}
                                </div>
                            </div>
                            
                            <span 
                                class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border"
                                :style="{
                                    color: milestone.color,
                                    borderColor: milestone.color + '40',
                                    backgroundColor: milestone.color + '15'
                                }"
                            >
                                {{ milestone.status }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="py-12 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                        <svg class="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h8m-8 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <span class="text-xs font-semibold text-slate-300">No active milestones registered.</span>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
