<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import BrandLogos from '@/Components/BrandLogos.vue';

const page = usePage();
const user = computed(() => page.props.auth.user);
const userRoles = computed(() => user.value?.roles || []);
const flashMessage = computed(() => page.props.flash?.message);
const flashError = computed(() => page.props.flash?.error);

const isMobileMenuOpen = ref(false);

const hasRole = (roleName) => userRoles.value.includes(roleName);
const hasPermission = (permissionName) => user.value?.permissions?.includes(permissionName);
</script>

<template>
    <div class="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans antialiased relative overflow-x-hidden">
        
        <!-- Mobile Header Bar -->
        <header class="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between md:hidden w-full sticky top-0 z-50 shadow-sm">
            <BrandLogos name="smartconstruct" className="h-12 sm:h-14" />
            
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-600 hover:text-slate-900 p-2.5 rounded-xl bg-slate-100 border border-slate-200 transition-all active:scale-95">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>

        <!-- Sidebar Navigation -->
        <aside 
            :class="[
                'bg-white border-r border-slate-200/80 w-64 md:flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 shadow-sm',
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            ]"
        >
            <!-- Logo Header -->
            <div class="h-24 border-b border-slate-200/80 px-6 flex items-center">
                <BrandLogos name="smartconstruct" className="h-14 sm:h-16" />
            </div>

            <!-- User Profile Block -->
            <div v-if="user" class="p-5 border-b border-slate-200/80 flex items-center gap-3.5 bg-slate-50/60">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-200 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shrink-0">
                    {{ user.name.charAt(0) }}
                </div>
                <div class="overflow-hidden min-w-0">
                    <div class="font-bold text-slate-900 truncate text-xs tracking-tight">{{ user.name }}</div>
                    <div class="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-0.5 truncate">
                        {{ userRoles[0] || 'Member' }}
                    </div>
                </div>
            </div>

            <!-- Navigation Items -->
            <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto text-xs font-semibold">
                <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-3.5 mb-2">Main Controls</div>

                <Link
                    :href="route('dashboard')"
                    @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden border',
                        route().current('dashboard') 
                            ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-600/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    ]"
                >
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="9" rx="1.5" />
                        <rect x="14" y="3" width="7" height="5" rx="1.5" />
                        <rect x="3" y="16" width="7" height="5" rx="1.5" />
                        <rect x="14" y="12" width="7" height="9" rx="1.5" />
                    </svg>
                    Overview Console
                </Link>

                <Link
                    v-if="hasPermission('view materials')"
                    :href="route('materials.index')"
                    @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden border',
                        route().current('materials.index') 
                            ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-600/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    ]"
                >
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Material Stock Catalog
                </Link>

                <Link
                    v-if="hasPermission('view vendors')"
                    :href="route('vendors.index')"
                    @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden border',
                        route().current('vendors.index') 
                            ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-600/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    ]"
                >
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Vendor Directory
                </Link>

                <Link
                    v-if="hasPermission('view milestones')"
                    :href="route('milestones.index')"
                    @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden border',
                        route().current('milestones.index') 
                            ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-600/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    ]"
                >
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Milestone Tracker
                </Link>

                <div v-if="hasRole('SuperAdmin')" class="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-3.5 pt-6 mb-2">Governance</div>

                <!-- Admin RBAC Link -->
                <Link
                    v-if="hasRole('SuperAdmin')"
                    :href="route('admin.users.index')"
                    @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden border',
                        route().current('admin.users.index') 
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-md shadow-indigo-600/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    ]"
                >
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Access Control (RBAC)
                </Link>
            </nav>

            <!-- Bottom User Actions -->
            <div class="p-4 border-t border-slate-200/80 space-y-1 text-xs font-semibold">
                <Link
                    :href="route('profile.edit')"
                    @click="isMobileMenuOpen = false"
                    class="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                    <svg class="w-5 h-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile Settings
                </Link>

                <Link
                    :href="route('logout')"
                    method="post"
                    as="button"
                    class="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                    <svg class="w-5 h-5 shrink-0 text-slate-500 hover:text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </aside>

        <!-- Main Workspace Area -->
        <main class="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
            <!-- Top Navbar (Desktop view) -->
            <div class="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 lg:px-10 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <h1 class="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2.5">
                    <slot name="header"></slot>
                </h1>
                
                <div class="flex items-center gap-5">
                    <!-- Site Weather & Condition Widget -->
                    <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                        <span>🌤️</span>
                        <span>Dhaka Site #104</span>
                        <span class="text-slate-300">|</span>
                        <span class="font-extrabold text-slate-900">31°C Fair</span>
                    </div>

                    <!-- Live Project Switcher Badge -->
                    <div class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        Metro High-Rise Project #104
                    </div>

                    <!-- Role Badge -->
                    <div class="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-extrabold text-blue-700 uppercase tracking-widest shadow-sm">
                        {{ userRoles[0] || 'Guest' }}
                    </div>
                </div>
            </div>

            <!-- Toast Flash Message Banners -->
            <div v-if="flashMessage" class="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center justify-between shadow-sm animate-fade-in">
                <div class="flex items-center gap-2.5">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{{ flashMessage }}</span>
                </div>
            </div>

            <div v-if="flashError" class="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold flex items-center justify-between shadow-sm animate-fade-in">
                <div class="flex items-center gap-2.5">
                    <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>{{ flashError }}</span>
                </div>
            </div>

            <!-- Main Scrollable Page Area -->
            <div class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
                <slot></slot>
            </div>
        </main>

        <!-- Mobile Overlay Backdrop -->
        <div 
            v-if="isMobileMenuOpen" 
            @click="isMobileMenuOpen = false" 
            class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
        ></div>
    </div>
</template>
