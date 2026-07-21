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

        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 class="text-base font-bold text-white">System Permission & User Role Management</h2>
                    <p class="text-slate-400 text-xs mt-0.5">Assign system access levels (SuperAdmin, Project Manager, Site Engineer, Vendor) to team members.</p>
                </div>
            </div>

            <!-- Users List Table Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs text-slate-300">
                        <thead>
                            <tr class="bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                                <th class="px-6 py-4">User Name</th>
                                <th class="px-6 py-4">Email Address</th>
                                <th class="px-6 py-4">Current Assigned Role</th>
                                <th class="px-6 py-4 text-right">Assign New Role</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-800/40 transition-colors">
                                <td class="px-6 py-4 font-bold text-white flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shadow">
                                        {{ user.name.charAt(0) }}
                                    </div>
                                    <span>{{ user.name }}</span>
                                </td>
                                <td class="px-6 py-4 text-slate-300 font-medium">
                                    {{ user.email }}
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border"
                                        :class="[
                                            user.roles.includes('SuperAdmin') ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' :
                                            user.roles.includes('Project Manager') ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' :
                                            user.roles.includes('Site Engineer') ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' :
                                            'bg-slate-800 border-slate-700 text-slate-400'
                                        ]"
                                    >
                                        {{ user.roles[0] || 'No Role Assigned' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <select
                                        :value="user.roles[0]"
                                        @change="changeRole(user.id, $event.target.value)"
                                        class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 outline-none cursor-pointer"
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
