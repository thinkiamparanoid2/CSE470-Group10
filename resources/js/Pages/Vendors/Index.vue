<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import BrandLogos from '@/Components/BrandLogos.vue';

const props = defineProps({
    vendors: {
        type: Array,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    filters: {
        type: Object,
        required: true,
    },
    canManage: {
        type: Boolean,
        required: true,
    },
    canRate: {
        type: Boolean,
        required: true,
    },
});

// Helper to resolve company photo thumbnail
const getCompanyImage = (companyName) => {
    const lower = companyName.toLowerCase();
    if (lower.includes('bsrm') || lower.includes('steel')) {
        return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.includes('holcim') || lower.includes('lafarge') || lower.includes('seven rings') || lower.includes('cement')) {
        return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.includes('mir') || lower.includes('concrete') || lower.includes('readymix')) {
        return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.includes('berger') || lower.includes('paint')) {
        return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
};

// Fallback for broken images
const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
};

// Helper to resolve brand key
const getBrandKey = (companyName) => {
    const lower = companyName.toLowerCase();
    if (lower.includes('bsrm')) return 'bsrm';
    if (lower.includes('holcim') || lower.includes('lafarge')) return 'lafarge';
    if (lower.includes('seven rings')) return 'sevenrings';
    if (lower.includes('mir')) return 'mir';
    if (lower.includes('berger')) return 'berger';
    if (lower.includes('cat') || lower.includes('caterpillar')) return 'cat';
    return null;
};

// Filters
const search = ref(props.filters.search || '');
const category = ref(props.filters.category || '');

// Trigger filtering when inputs change
watch([search, category], () => {
    router.get(route('vendors.index'), {
        search: search.value,
        category: category.value
    }, {
        preserveState: true,
        replace: true
    });
});

const clearFilters = () => {
    search.value = '';
    category.value = '';
};

// Modals
const isCreateModalOpen = ref(false);
const isRateModalOpen = ref(false);
const selectedVendor = ref(null);
const hoverRating = ref(0);
const chosenRating = ref(5);

// Forms
const createForm = useForm({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    category: '',
});

const submitCreate = () => {
    createForm.post(route('vendors.store'), {
        onSuccess: () => {
            isCreateModalOpen.value = false;
            createForm.reset();
        }
    });
};

const openRateModal = (vendor) => {
    selectedVendor.value = vendor;
    chosenRating.value = 5;
    isRateModalOpen.value = true;
};

const submitRating = () => {
    useForm({
        rating: chosenRating.value
    }).post(route('vendors.rate', selectedVendor.value.id), {
        onSuccess: () => {
            isRateModalOpen.value = false;
            selectedVendor.value = null;
        }
    });
};
</script>

<template>
    <Head title="Suppliers Directory" />

    <AuthenticatedLayout>
        <template #header>
            Vendor & Supplier Directory
        </template>

        <div class="space-y-6 sm:space-y-8">
            <!-- Header Section -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div class="lg:col-span-8 space-y-2 relative z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                        Verified Supply Chain
                    </div>
                    <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Verified Construction Suppliers & Partners</h2>
                    <p class="text-blue-100 text-xs sm:text-sm font-medium">Verify supplier business profiles, log performance scorecards, and audit quality ratings.</p>
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
                        Register New Supplier
                    </button>
                </div>
            </div>

            <!-- Filter Controls -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <div class="md:col-span-6 relative">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search partners by business name or category (e.g. BSRM, LafargeHolcim)..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    />
                    <svg class="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div class="md:col-span-4 text-xs font-semibold">
                    <select
                        v-model="category"
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none transition-all cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        <option v-for="cat in categories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-2 text-right">
                    <button
                        v-if="search || category"
                        @click="clearFilters"
                        class="text-xs font-extrabold text-rose-600 hover:text-rose-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <!-- Vendor Cards Grid -->
            <div v-if="vendors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="vendor in vendors"
                    :key="vendor.id"
                    class="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                >
                    <!-- Company Card Cover Image -->
                    <div class="h-32 relative overflow-hidden bg-slate-100">
                        <img 
                            :src="getCompanyImage(vendor.company_name)" 
                            :alt="vendor.company_name" 
                            @error="handleImageError"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                            <span class="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-white/90 text-slate-900 backdrop-blur-md uppercase tracking-widest">
                                {{ vendor.category }}
                            </span>
                        </div>
                    </div>

                    <div class="p-6 space-y-5 flex-1 flex flex-col justify-between">
                        <div class="space-y-4">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h3 class="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
                                        {{ vendor.company_name }}
                                    </h3>
                                </div>
                                <BrandLogos v-if="getBrandKey(vendor.company_name)" :name="getBrandKey(vendor.company_name)" :compact="true" />
                            </div>

                            <!-- Rating Summary -->
                            <div class="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 w-fit text-xs font-bold">
                                <div class="flex text-amber-500 text-xs gap-0.5">
                                    <span v-for="i in 5" :key="i">
                                        {{ i <= Math.round(vendor.average_rating) ? '★' : '☆' }}
                                    </span>
                                </div>
                                <span class="text-slate-900 font-extrabold pl-1">
                                    {{ vendor.average_rating.toFixed(1) }}
                                </span>
                                <span class="text-slate-500 font-semibold text-[11px]">
                                    ({{ vendor.rating_count }} reviews)
                                </span>
                            </div>

                            <!-- Contact Details -->
                            <div class="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600 font-medium">
                                <div class="flex items-center gap-3">
                                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{{ vendor.name }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span class="truncate">{{ vendor.email }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>{{ vendor.phone }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Rate Button Action -->
                        <button
                            v-if="canRate"
                            @click="openRateModal(vendor)"
                            class="w-full py-3 rounded-2xl bg-slate-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-slate-200 hover:border-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.772-.563-.373-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                            </svg>
                            Submit Performance Score
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty Directory State -->
            <div v-else class="py-20 text-center space-y-4 bg-white border border-slate-200/80 rounded-3xl">
                <svg class="w-12 h-12 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                </svg>
                <div class="space-y-1">
                    <h3 class="text-sm font-bold text-slate-900">No Suppliers Found</h3>
                    <p class="text-xs text-slate-500">Try adjusting search filters or category selection.</p>
                </div>
            </div>
        </div>

        <!-- Register Vendor Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Register Supplier Partner</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-2">Company Business Name</label>
                        <input v-model="createForm.company_name" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. BSRM Steels Ltd" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Supplier Category</label>
                            <input v-model="createForm.category" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. Cement, Steel" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Contact Representative</label>
                            <input v-model="createForm.name" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. Engr. Rafiqul Islam" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Business Email</label>
                            <input v-model="createForm.email" required type="email" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="sales@company.com" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Office Phone Number</label>
                            <input v-model="createForm.phone" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="+880 1700-000000" />
                        </div>
                    </div>

                    <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" @click="isCreateModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Register Supplier</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Rating Submission Modal -->
        <div v-if="isRateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Submit Performance Score</h3>
                        <p class="text-xs text-blue-600 font-extrabold mt-1">{{ selectedVendor?.company_name }}</p>
                    </div>
                    <button @click="isRateModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div class="space-y-5 py-4 flex flex-col items-center">
                    <span class="text-slate-700 text-xs font-semibold">Select score rating (1 to 5 stars):</span>
                    
                    <!-- Star Rating Interactive Widget -->
                    <div class="flex items-center gap-2">
                        <button
                            v-for="star in 5"
                            :key="star"
                            type="button"
                            @click="chosenRating = star"
                            @mouseover="hoverRating = star"
                            @mouseleave="hoverRating = 0"
                            class="text-4xl transition-transform hover:scale-110 focus:outline-none"
                            :class="(hoverRating ? star <= hoverRating : star <= chosenRating) ? 'text-amber-500' : 'text-slate-200'"
                        >
                            ★
                        </button>
                    </div>
                    
                    <span class="text-xs font-extrabold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                        {{ chosenRating === 1 ? 'Poor Quality' : chosenRating === 2 ? 'Substandard' : chosenRating === 3 ? 'Acceptable' : chosenRating === 4 ? 'Good Quality' : 'Outstanding Service' }}
                    </span>
                </div>

                <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button type="button" @click="isRateModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                    <button type="button" @click="submitRating" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Confirm Score</button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
