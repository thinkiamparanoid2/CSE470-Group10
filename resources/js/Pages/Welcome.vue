<script setup>
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    canLogin: {
        type: Boolean,
    },
    canRegister: {
        type: Boolean,
    },
});
</script>

<template>
    <Head title="SmartConstruct - High-End Infrastructure ERP" />
    <div class="min-h-screen bg-[#0b0f19] text-slate-300 font-sans antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
        
        <!-- Refined Ambient Lighting -->
        <div class="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-600/10 to-indigo-600/5 blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-500/10 to-blue-900/10 blur-[100px] pointer-events-none"></div>

        <!-- Ultra-Premium Header -->
        <header class="relative border-b border-white/[0.03] bg-[#0b0f19]/70 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-500">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
                <!-- Brand logo -->
                <div class="flex items-center gap-3.5 group cursor-pointer">
                    <div class="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-500 ease-out">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <span class="text-sm font-extrabold tracking-[0.2em] text-white uppercase">Smart<span class="text-blue-400 font-medium">Construct</span></span>
                </div>
                
                <nav v-if="canLogin" class="flex items-center gap-6">
                    <Link
                        v-if="$page.props.auth.user"
                        :href="route('dashboard')"
                        class="px-6 py-3 rounded-xl text-xs font-bold tracking-wide bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 duration-300"
                    >
                        Access Console
                    </Link>

                    <template v-else>
                        <Link
                            :href="route('login')"
                            class="text-xs font-bold tracking-wide text-slate-400 hover:text-white transition-colors duration-300"
                        >
                            Sign In
                        </Link>

                        <Link
                            v-if="canRegister"
                            class="px-6 py-3 rounded-xl text-xs font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 duration-300"
                            :href="route('register')"
                        >
                            Register Identity
                        </Link>
                    </template>
                </nav>
            </div>
        </header>

        <!-- Cinematic Hero Section -->
        <section class="relative pt-32 pb-40">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    
                    <div class="lg:col-span-6 space-y-10 text-center lg:text-left">
                        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md">
                            <span class="flex h-2 w-2 rounded-full bg-blue-500 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            </span>
                            <span class="text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase">Metro Infrastructure ERP v2.0</span>
                        </div>
                        
                        <h1 class="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tighter leading-[1.05]">
                            Manage scale with <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">precision.</span>
                        </h1>
                        
                        <p class="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed tracking-wide">
                            A refined executive ERP console designed for regional infrastructure operations. Seamlessly connect BSRM steel rebar, LafargeHolcim cement stocks, supplier performance ratings, and project milestone schedules in one unified platform.
                        </p>
                        
                        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4">
                            <Link
                                v-if="!$page.props.auth.user"
                                :href="route('login')"
                                class="px-8 py-4 rounded-xl text-xs font-bold tracking-wide bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 duration-300"
                            >
                                Get Started
                            </Link>
                            <Link
                                v-else
                                :href="route('dashboard')"
                                class="px-8 py-4 rounded-xl text-xs font-bold tracking-wide bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 duration-300"
                            >
                                Dashboard Console
                            </Link>
                            <a
                                href="#features"
                                class="px-8 py-4 rounded-xl text-xs font-bold tracking-wide bg-transparent text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                            >
                                Explore Modules
                            </a>
                        </div>
                    </div>
                    
                    <!-- High-End Image Composition -->
                    <div class="lg:col-span-6 relative">
                        <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>
                        <div class="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] group">
                            <!-- Dummy Image: High-end modern urban construction -->
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop" alt="Metro Infrastructure Project" class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
                            <div class="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-700"></div>
                            
                            <!-- Floating UI Element -->
                            <div class="absolute bottom-8 left-8 right-8 bg-[#0b0f19]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5">
                                            <div class="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                                                <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="text-white font-bold tracking-wide">Cast-in-Situ Piling Complete</div>
                                            <div class="text-slate-400 text-xs mt-0.5">Basement Mat Raft & BSRM Rebar Cage</div>
                                        </div>
                                    </div>
                                    <div class="text-right hidden sm:block">
                                        <div class="text-emerald-400 font-bold text-lg">100%</div>
                                        <div class="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Phase Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trusted By Regional Manufacturers -->
        <section class="border-y border-white/[0.02] bg-slate-900/20 py-16">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                <p class="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-10">Integrated with Leading Regional Building Material Suppliers</p>
                <div class="flex flex-wrap justify-center gap-12 sm:gap-20 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div class="text-xl font-black tracking-widest text-white uppercase italic">BSRM<span class="text-blue-500 font-normal text-xs uppercase tracking-normal"> Steels</span></div>
                    <div class="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">LafargeHolcim</div>
                    <div class="text-xl font-bold tracking-tight text-white">Seven Rings Cement</div>
                    <div class="text-xl font-extrabold tracking-tighter text-white">Mir Concrete</div>
                    <div class="text-xl font-bold tracking-tight text-white">Berger Paints</div>
                </div>
            </div>
        </section>

        <!-- Bento Box Features -->
        <section id="features" class="py-40 relative">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div class="mb-24 md:flex items-end justify-between">
                    <div class="max-w-2xl">
                        <h2 class="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Core Architecture</h2>
                        <p class="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">Everything you need to scale operations.</p>
                    </div>
                    <p class="text-slate-400 text-sm max-w-sm font-medium mt-6 md:mt-0 leading-relaxed">
                        Built for speed and precision. Tailored specifically for regional high-rise and commercial infrastructure projects.
                    </p>
                </div>
                
                <!-- Bento Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[280px]">
                    
                    <!-- Large Feature: Inventory Management -->
                    <div class="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-900/40 border border-white/5 overflow-hidden relative group hover:border-white/10 transition-colors duration-500">
                        <img src="https://images.unsplash.com/photo-1541888081691-10c732890e0c?q=80&w=2940&auto=format&fit=crop" alt="Construction Materials" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700 mix-blend-overlay" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent"></div>
                        
                        <div class="absolute inset-x-0 bottom-0 p-10 lg:p-12">
                            <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 class="text-3xl font-extrabold text-white tracking-tight mb-3">Resource Catalogs</h3>
                            <p class="text-slate-400 text-sm font-medium max-w-md leading-relaxed">
                                Track 500W steel rebar, composite cement, Sylhet sand, and stone chips. Run real-time stock allocation checks with custom low-stock thresholds.
                            </p>
                        </div>
                    </div>

                    <!-- Small Feature: RBAC -->
                    <div class="rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/5 p-8 relative group hover:border-white/10 transition-colors duration-500 flex flex-col justify-between overflow-hidden">
                        <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-4 -translate-y-4">
                            <svg class="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                        </div>
                        <div class="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white tracking-tight mb-2">Corporate RBAC</h3>
                            <p class="text-slate-400 text-xs font-medium leading-relaxed">
                                Granular roles and permission gates. Audit panels instantly as PMs, Engineers, or Vendors.
                            </p>
                        </div>
                    </div>

                    <!-- Small Feature: Vendor Network -->
                    <div class="rounded-3xl bg-slate-900/40 border border-white/5 p-8 relative group hover:border-white/10 transition-colors duration-500 flex flex-col justify-between">
                        <div class="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white tracking-tight mb-2">Vendor Network</h3>
                            <p class="text-slate-400 text-xs font-medium leading-relaxed">
                                Maintain verified profiles. Run audits by category and submit performance rating reports.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Premium CTA Section -->
        <section class="py-24 relative overflow-hidden">
            <div class="absolute inset-0 bg-blue-600/5"></div>
            <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">Ready to upgrade your infrastructure management?</h2>
                <p class="text-slate-400 text-base font-medium mb-10 max-w-2xl mx-auto">
                    Join the regional construction firms using SmartConstruct to maintain operational clarity across all project sites.
                </p>
                <Link
                    v-if="!$page.props.auth.user"
                    :href="route('register')"
                    class="inline-block px-10 py-5 rounded-2xl text-sm font-bold tracking-wide bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 duration-300"
                >
                    Create Enterprise Account
                </Link>
                <Link
                    v-else
                    :href="route('dashboard')"
                    class="inline-block px-10 py-5 rounded-2xl text-sm font-bold tracking-wide bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 duration-300"
                >
                    Enter Dashboard
                </Link>
            </div>
        </section>

        <!-- Refined Footer -->
        <footer class="border-t border-white/[0.05] bg-[#0b0f19] pt-16 pb-8 relative z-10">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 flex items-center justify-center bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <span class="text-xs font-bold tracking-[0.2em] text-white uppercase">Smart<span class="text-slate-500">Construct</span></span>
                </div>
                <div class="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
                    &copy; 2026 SmartConstruct ERP. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
</template>
