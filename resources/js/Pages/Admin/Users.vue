<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({
    users: {
        type: Array,
        required: true,
    },
    roles: {
        type: Array,
        required: true,
    },
});

const changeRole = (userId, newRole) => {
    useForm({
        role: newRole
    }).post(route('admin.users.role', userId));
};
</script>

<template>
    <Head title="Access Control (RBAC)" />

    <AuthenticatedLayout>
        <template #header>
            Role-Based Access Control (RBAC)
        </template>

        <div class="space-y-6 sm:space-y-8">
            <!-- Header Section -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div class="lg:col-span-8 space-y-2 relative z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                        Security Governance
                    </div>
                    <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Role-Based Access Control (RBAC) Management</h2>
                    <p class="text-indigo-100 text-xs sm:text-sm font-medium">Assign enterprise system roles (SuperAdmin, Project Manager, Site Engineer, Vendor) and align security permissions.</p>
                </div>
            </div>

            <!-- Users List Table Card -->
            <div class="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs text-slate-700">
                        <thead>
                            <tr class="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                <th class="px-6 py-4">User Name</th>
                                <th class="px-6 py-4">Corporate Email</th>
                                <th class="px-6 py-4">Current Active Role</th>
                                <th class="px-6 py-4 text-right">Assign New Role</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/80 transition-colors group">
                                <td class="px-6 py-4 font-bold text-slate-900 flex items-center gap-3.5">
                                    <div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-extrabold text-indigo-700 text-xs shadow-sm group-hover:scale-105 transition-transform">
                                        {{ user.name.charAt(0) }}
                                    </div>
                                    <span class="group-hover:text-indigo-600 transition-colors">{{ user.name }}</span>
                                </td>
                                <td class="px-6 py-4 text-slate-500 font-medium">
                                    {{ user.email }}
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase border tracking-wider"
                                        :class="[
                                            user.roles.includes('SuperAdmin') ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                            user.roles.includes('Project Manager') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                            user.roles.includes('Site Engineer') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                            'bg-slate-100 border-slate-200 text-slate-600'
                                        ]"
                                    >
                                        {{ user.roles[0] || 'No Role Assigned' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <select
                                        :value="user.roles[0]"
                                        @change="changeRole(user.id, $event.target.value)"
                                        class="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-600 outline-none transition-all cursor-pointer shadow-sm"
                                    >
                                        <option v-for="role in roles" :key="role" :value="role">
                                            {{ role }}
                                        </option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
