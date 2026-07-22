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
            Executive Overview Console
        </template>

        <div class="space-y-6 sm:space-y-8">
            <!-- Top Banner Card -->
            <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
                <div class="flex items-center justify-between flex-wrap gap-6 relative z-10">
                    <div class="space-y-2">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Construction Operations
                        </div>
                        <h2 class="text-xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {{ $page.props.auth.user.name }}</h2>
                        <p class="text-blue-100 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
                            Monitor raw building material stock levels, verified vendor scorecards, and structural milestone deadlines for Project Site #104.
                        </p>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <Link :href="route('materials.index')" class="flex-1 sm:flex-none text-center px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold tracking-wide transition-all shadow-md hover:scale-105">
                            Manage Inventory
                        </Link>
                        <Link :href="route('milestones.index')" class="flex-1 sm:flex-none text-center px-5 py-3 rounded-xl bg-blue-700/80 hover:bg-blue-800 text-white border border-blue-400/30 text-xs font-extrabold tracking-wide transition-all hover:scale-105">
                            View Calendar
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Essential KPI Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <!-- Total Materials Card -->
                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                    <div class="space-y-4 relative z-10">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Resource Items</span>
                            <div class="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalMaterials }}</div>
                            <span class="text-slate-500 text-[11px] font-semibold">Tracked Material Types</span>
                        </div>
                    </div>
                </div>

                <!-- Low Stock Items Card -->
                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                    <div class="space-y-4 relative z-10">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Stock Warnings</span>
                            <div class="w-10 h-10 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform" :class="stats.lowStockCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div class="text-3xl font-extrabold tracking-tight" :class="stats.lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'">
                                {{ stats.lowStockCount }}
                            </div>
                            <span class="text-slate-500 text-[11px] font-semibold">Below Safety Threshold</span>
                        </div>
                    </div>
                </div>

                <!-- Total Vendors Card -->
                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                    <div class="space-y-4 relative z-10">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Suppliers</span>
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalVendors }}</div>
                            <span class="text-slate-500 text-[11px] font-semibold">Verified Corporate Partners</span>
                        </div>
                    </div>
                </div>

                <!-- Active Milestones Card -->
                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                    <div class="space-y-4 relative z-10">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Phases</span>
                            <div class="w-10 h-10 bg-teal-50 text-teal-600 border border-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.activeMilestonesCount }}</div>
                            <span class="text-slate-500 text-[11px] font-semibold">Scheduled Structural Phases</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Operations Grid: Critical Inventory & Milestones -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <!-- Critical Inventory Table (Left) -->
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-6 flex flex-col space-y-6 relative overflow-hidden">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-5">
                        <div class="space-y-1">
                            <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Stock Warnings & Reorder Alerts</h3>
                            <p class="text-xs text-slate-500 font-medium">Inventory items reaching critical reorder levels</p>
                        </div>
                        <Link :href="route('materials.index')" class="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 shrink-0">
                            <span>View All</span>
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                        </Link>
                    </div>

                    <div v-if="lowStockMaterials.length > 0" class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-700 border-collapse min-w-[320px]">
                            <thead>
                                <tr class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-200/80 bg-slate-50/60">
                                    <th class="py-3 px-3">Material Name</th>
                                    <th class="py-3 px-3 text-right">Stock</th>
                                    <th class="py-3 px-3 text-right">Alert Level</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="material in lowStockMaterials" :key="material.id" class="hover:bg-slate-50/80 transition-colors">
                                    <td class="py-4 px-3 font-bold text-slate-900 flex items-center gap-3">
                                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] shrink-0"></span>
                                        <span class="truncate">{{ material.name }}</span>
                                    </td>
                                    <td class="py-4 px-3 text-right font-extrabold text-rose-600">
                                        {{ material.quantity }} <span class="text-[10px] text-slate-500 font-medium uppercase">{{ material.unit }}</span>
                                    </td>
                                    <td class="py-4 px-3 text-right text-slate-500 font-medium">
                                        {{ material.reorder_level }} <span class="text-[10px] uppercase">{{ material.unit }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="py-14 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span class="text-xs font-bold text-slate-900">Stock Status Optimal</span>
                        <p class="text-xs text-slate-500 max-w-xs">All cataloged building materials are currently above safety threshold levels.</p>
                    </div>
                </div>

                <!-- Milestone Schedule Timeline (Right) -->
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-6 flex flex-col space-y-6 relative overflow-hidden">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-5">
                        <div class="space-y-1">
                            <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Upcoming Project Phases</h3>
                            <p class="text-xs text-slate-500 font-medium">Key structural milestones and schedule timelines</p>
                        </div>
                        <Link :href="route('milestones.index')" class="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 shrink-0">
                            <span>Open Calendar</span>
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                        </Link>
                    </div>

                    <div v-if="upcomingMilestones.length > 0" class="space-y-4">
                        <div v-for="milestone in upcomingMilestones" :key="milestone.id" class="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-4 group">
                            <div class="space-y-1.5 min-w-0">
                                <div class="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-blue-600 transition-colors truncate">{{ milestone.title }}</div>
                                <div class="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                                    <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    <span class="truncate">{{ milestone.start_date }} &mdash; {{ milestone.end_date }}</span>
                                </div>
                            </div>
                            
                            <span 
                                class="px-3 py-1 text-[10px] font-extrabold uppercase rounded-xl border shrink-0"
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
                    <div v-else class="py-14 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <svg class="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h8m-8 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <span class="text-xs font-bold text-slate-700">No Active Milestones Scheduled</span>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
