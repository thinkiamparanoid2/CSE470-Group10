<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const user = computed(() => page.props.auth.user);
const userRoles = computed(() => user.value?.roles || []);

const isMobileMenuOpen = ref(false);

const hasRole = (roleName) => userRoles.value.includes(roleName);
const hasPermission = (permissionName) => user.value?.permissions?.includes(permissionName);
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans antialiased">

        <!-- Mobile Header -->
        <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between md:hidden w-full sticky top-0 z-50">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-600 rounded-lg text-white shadow">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <span class="text-sm font-bold tracking-wider text-white uppercase">Smart<span class="text-blue-400 font-normal">Construct</span></span>
            </div>
            
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>

        <!-- Sidebar Navigation -->
        <aside 
            :class="[
                'bg-slate-900 border-r border-slate-800 w-64 md:flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 shadow-xl',
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            ]"
        >
            <!-- Logo Section -->
            <div class="h-16 border-b border-slate-800 px-6 flex items-center gap-3">
                <div class="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white shadow">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <span class="text-xs font-extrabold tracking-[0.15em] text-white uppercase">Smart<span class="text-blue-400 font-normal">Construct</span></span>
            </div>

            <!-- User Profile Block -->
            <div v-if="user" class="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
                <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-extrabold text-blue-400 text-sm shadow">
                    {{ user.name.charAt(0) }}
                </div>
                <div class="overflow-hidden">
                    <div class="font-bold text-white truncate text-xs">{{ user.name }}</div>
                    <div class="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mt-0.5">
                        {{ userRoles[0] || 'Member' }}
                    </div>
                </div>
            </div>

            <!-- Nav Links -->
            <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto text-xs font-semibold">
                <Link
                    :href="route('dashboard')"
                    :class="[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors',
                        route().current('dashboard') 
                            ? 'bg-blue-600 text-white font-bold shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    ]"
                >
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                    </svg>
                    Overview Dashboard
                </Link>

                <Link
                    v-if="hasPermission('view materials')"
                    :href="route('materials.index')"
                    :class="[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors',
                        route().current('materials.index') 
                            ? 'bg-blue-600 text-white font-bold shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    ]"
                >
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Material Stock Catalog
                </Link>

                <Link
                    v-if="hasPermission('view vendors')"
                    :href="route('vendors.index')"
                    :class="[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors',
                        route().current('vendors.index') 
                            ? 'bg-blue-600 text-white font-bold shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    ]"
                >
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Vendor Directory
                </Link>

                <Link
                    v-if="hasPermission('view milestones')"
                    :href="route('milestones.index')"
                    :class="[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors',
                        route().current('milestones.index') 
                            ? 'bg-blue-600 text-white font-bold shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    ]"
                >
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Milestone Tracker
                </Link>

                <!-- Admin Link -->
                <Link
                    v-if="hasRole('SuperAdmin')"
                    :href="route('admin.users.index')"
                    :class="[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors mt-6',
                        route().current('admin.users.index') 
                            ? 'bg-indigo-600 text-white font-bold shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    ]"
                >
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Access Control (RBAC)
                </Link>
            </nav>

            <!-- Bottom Actions -->
            <div class="p-4 border-t border-slate-800 space-y-1 text-xs font-semibold">
                <Link
                    :href="route('profile.edit')"
                    class="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Profile Settings
                </Link>

                <Link
                    :href="route('logout')"
                    method="post"
                    as="button"
                    class="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col min-w-0 bg-slate-950">
            <!-- Top Navbar (Desktop only) -->
            <div class="h-16 bg-slate-900 border-b border-slate-800 px-8 hidden md:flex items-center justify-between sticky top-0 z-30">
                <h1 class="text-sm font-bold text-white tracking-wide">
                    <slot name="header"></slot>
                </h1>
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Project Site #104 Active
                    </div>
                    <!-- Role Badge -->
                    <div class="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        {{ userRoles[0] || 'Guest' }}
                    </div>
                </div>
            </div>

            <!-- Page Body -->
            <div class="flex-1 p-6 md:p-8 overflow-y-auto">
                <slot></slot>
            </div>
        </main>

        <!-- Mobile menu backdrop -->
        <div 
            v-if="isMobileMenuOpen" 
            @click="isMobileMenuOpen = false" 
            class="fixed inset-0 bg-slate-950/80 z-30 md:hidden"
        ></div>
    </div>
</template>
