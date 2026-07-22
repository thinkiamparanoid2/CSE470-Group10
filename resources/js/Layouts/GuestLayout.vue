<script setup>
import BrandLogos from '@/Components/BrandLogos.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
});
</script>

<template>
    <div class="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased relative overflow-hidden flex">
        
        <!-- Left Brand Hero Panel (Desktop) -->
        <div class="hidden lg:flex lg:w-[48%] xl:w-[45%] relative flex-col justify-between p-12 xl:p-16 bg-white border-r border-slate-200/80 shadow-sm z-10">
            <div>
                <Link href="/">
                    <BrandLogos name="smartconstruct" className="h-16 sm:h-20 cursor-pointer" />
                </Link>
            </div>

            <div class="space-y-8 max-w-md my-auto">
                <div class="space-y-4">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-widest">
                        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Enterprise Infrastructure ERP
                    </div>
                    <h1 class="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                        Precision control for
                        <span class="text-blue-600">construction scale.</span>
                    </h1>
                    <p class="text-slate-600 text-sm leading-relaxed font-medium">
                        Unified material inventories, verified supplier directory, and project milestone schedules — designed for mega infrastructure operations.
                    </p>
                </div>

                <!-- Feature Pillars -->
                <div class="space-y-4 pt-2">
                    <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-extrabold text-slate-900">Enterprise Security Governance</p>
                            <p class="text-[11px] text-slate-500 font-medium mt-0.5">Role-Based Access Control (RBAC) built in</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-extrabold text-slate-900">Real-Time Site Operations</p>
                            <p class="text-[11px] text-slate-500 font-medium mt-0.5">Live stock warnings & milestone tracking</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                &copy; 2026 SmartConstruct ERP. All rights reserved.
            </div>
        </div>

        <!-- Right Form Panel -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-8 relative z-10 bg-[#f8fafc]">
            <!-- Mobile Logo -->
            <Link href="/" class="lg:hidden mb-8">
                <BrandLogos name="smartconstruct" className="h-14 sm:h-16" />
            </Link>

            <div class="w-full max-w-md space-y-6">
                <!-- Title Block -->
                <div v-if="title" class="space-y-1.5 text-center lg:text-left">
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{{ title }}</h2>
                    <p v-if="subtitle" class="text-xs sm:text-sm text-slate-500 font-medium">{{ subtitle }}</p>
                </div>

                <!-- Form White Card Container -->
                <div class="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
