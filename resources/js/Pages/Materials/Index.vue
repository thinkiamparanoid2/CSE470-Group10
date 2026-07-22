<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import BrandLogos from '@/Components/BrandLogos.vue';

const props = defineProps({
    materials: {
        type: Array,
        required: true,
    },
    canManage: {
        type: Boolean,
        required: true,
    },
    canUse: {
        type: Boolean,
        required: true,
    },
});

// Modals State
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isAdjustModalOpen = ref(false);
const selectedMaterial = ref(null);
const searchQuery = ref('');

// Helper to resolve material image thumbnail
const getMaterialImage = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('steel') || lower.includes('rod') || lower.includes('bsrm') || lower.includes('rebar')) {
        return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80';
    }
    if (lower.includes('cement') || lower.includes('holcim') || lower.includes('seven rings')) {
        return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80';
    }
    if (lower.includes('brick') || lower.includes('auto')) {
        return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&auto=format&fit=crop&q=80';
    }
    if (lower.includes('sand') || lower.includes('chips') || lower.includes('aggregate')) {
        return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80';
    }
    if (lower.includes('paint') || lower.includes('berger')) {
        return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=80';
    }
    if (lower.includes('concrete') || lower.includes('readymix') || lower.includes('mir')) {
        return 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=200&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=200&auto=format&fit=crop&q=80';
};

// Helper to resolve brand logo key
const getBrandKey = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('bsrm')) return 'bsrm';
    if (lower.includes('holcim') || lower.includes('lafarge')) return 'lafarge';
    if (lower.includes('seven rings')) return 'sevenrings';
    if (lower.includes('mir') || lower.includes('readymix')) return 'mir';
    if (lower.includes('berger')) return 'berger';
    if (lower.includes('cat') || lower.includes('caterpillar')) return 'cat';
    return null;
};

// Computed Analytics
const totalValuation = computed(() => {
    return props.materials.reduce((sum, item) => sum + (item.quantity * item.price), 0);
});

const lowStockCount = computed(() => {
    return props.materials.filter(item => item.quantity <= item.reorder_level).length;
});

const filteredMaterials = computed(() => {
    if (!searchQuery.value) return props.materials;
    return props.materials.filter(m => m.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Forms
const createForm = useForm({
    name: '',
    unit: '',
    quantity: 0,
    reorder_level: 10,
    price: 0.00,
});

const editForm = useForm({
    name: '',
    unit: '',
    quantity: 0,
    reorder_level: 10,
    price: 0.00,
});

const adjustForm = useForm({
    type: 'add',
    amount: 1,
});

// Operations
const openEditModal = (material) => {
    selectedMaterial.value = material;
    editForm.name = material.name;
    editForm.unit = material.unit;
    editForm.quantity = material.quantity;
    editForm.reorder_level = material.reorder_level;
    editForm.price = material.price;
    isEditModalOpen.value = true;
};

const openAdjustModal = (material) => {
    selectedMaterial.value = material;
    adjustForm.type = 'consume';
    adjustForm.amount = 1;
    isAdjustModalOpen.value = true;
};

const submitCreate = () => {
    createForm.post(route('materials.store'), {
        onSuccess: () => {
            isCreateModalOpen.value = false;
            createForm.reset();
        }
    });
};

const submitEdit = () => {
    editForm.patch(route('materials.update', selectedMaterial.value.id), {
        onSuccess: () => {
            isEditModalOpen.value = false;
            selectedMaterial.value = null;
        }
    });
};

const submitAdjust = () => {
    adjustForm.post(route('materials.stock', selectedMaterial.value.id), {
        onSuccess: () => {
            isAdjustModalOpen.value = false;
            selectedMaterial.value = null;
        }
    });
};

const deleteMaterial = (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
        useForm({}).delete(route('materials.destroy', id));
    }
};
</script>

<template>
    <Head title="Resources Catalog" />

    <AuthenticatedLayout>
        <template #header>
            Material Stock Catalog
        </template>

        <div class="space-y-6 sm:space-y-8">
            <!-- Header Banner -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div class="lg:col-span-8 space-y-2 relative z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                        Site Inventory Command
                    </div>
                    <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Construction Materials & Inventory Catalog</h2>
                    <p class="text-blue-100 text-xs sm:text-sm font-medium">Record building resources (steel rebar, cement, bricks, aggregates), monitor stock levels, and set safety alerts.</p>
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
                        Add New Material
                    </button>
                </div>
            </div>

            <!-- Summary KPI Badges -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Cataloged</span>
                        <div class="text-2xl font-extrabold text-slate-900 mt-1">{{ materials.length }} <span class="text-xs font-medium text-slate-500">Items</span></div>
                    </div>
                    <div class="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                </div>

                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Stock Valuation</span>
                        <div class="text-2xl font-extrabold text-slate-900 mt-1">৳ {{ totalValuation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</div>
                    </div>
                    <div class="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                </div>

                <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
                        <div class="text-2xl font-extrabold mt-1" :class="lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'">
                            {{ lowStockCount }} <span class="text-xs font-medium text-slate-500">Alerts</span>
                        </div>
                    </div>
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center border" :class="lowStockCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                </div>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search material items by name (e.g. BSRM Steel, Holcim Cement)..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    />
                    <svg class="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Materials Table Card -->
            <div class="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs text-slate-700">
                        <thead>
                            <tr class="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                <th class="px-6 py-4">Resource Item & Real Brand</th>
                                <th class="px-6 py-4 text-right">Available Stock</th>
                                <th class="px-6 py-4">Reorder Threshold</th>
                                <th class="px-6 py-4 text-right">Unit Price</th>
                                <th class="px-6 py-4 text-right">Valuation</th>
                                <th class="px-6 py-4 text-center">Status</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="material in filteredMaterials" :key="material.id" class="hover:bg-slate-50/80 transition-colors group">
                                <td class="px-6 py-4 font-bold text-slate-900 tracking-wide">
                                    <div class="flex items-center gap-3.5">
                                        <!-- Material Photo Thumbnail -->
                                        <img :src="getMaterialImage(material.name)" :alt="material.name" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 group-hover:scale-105 transition-transform" />
                                        <div class="space-y-1 overflow-hidden">
                                            <div class="text-slate-900 font-extrabold text-xs tracking-tight truncate">{{ material.name }}</div>
                                            <BrandLogos v-if="getBrandKey(material.name)" :name="getBrandKey(material.name)" :compact="true" />
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right font-extrabold" :class="material.quantity <= material.reorder_level ? 'text-rose-600' : 'text-slate-900'">
                                    {{ material.quantity }} <span class="text-[10px] text-slate-500 font-medium uppercase">{{ material.unit }}</span>
                                </td>
                                <td class="px-6 py-4 text-slate-500 font-medium">
                                    {{ material.reorder_level }} {{ material.unit }}
                                </td>
                                <td class="px-6 py-4 text-right text-slate-700 font-semibold whitespace-nowrap">
                                    ৳ {{ Number(material.price).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                                </td>
                                <td class="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                    ৳ {{ (material.quantity * material.price).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        v-if="material.quantity <= material.reorder_level"
                                        class="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider whitespace-nowrap inline-flex items-center justify-center"
                                    >
                                        Low Stock
                                    </span>
                                    <span
                                        v-else
                                        class="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider whitespace-nowrap inline-flex items-center justify-center"
                                    >
                                        Optimal
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <!-- Quick Stock Adjustment -->
                                        <button
                                            v-if="canUse"
                                            @click="openAdjustModal(material)"
                                            title="Consume or Restock"
                                            class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold transition-all hover:scale-105 whitespace-nowrap"
                                        >
                                            Update Stock
                                        </button>

                                        <!-- Edit -->
                                        <button
                                            v-if="canManage"
                                            @click="openEditModal(material)"
                                            class="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <!-- Delete -->
                                        <button
                                            v-if="canManage"
                                            @click="deleteMaterial(material.id)"
                                            class="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Material Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Add New Building Material</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-2">Material / Item Name</label>
                        <input v-model="createForm.name" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. BSRM Steel 500W Deformed Bar (16mm)" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Unit Type</label>
                            <input v-model="createForm.unit" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" placeholder="e.g. Tons, Bags, CFT" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Unit Price (৳)</label>
                            <input v-model="createForm.price" required type="number" step="0.01" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Initial Stock Quantity</label>
                            <input v-model="createForm.quantity" required type="number" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Reorder Alert Level</label>
                            <input v-model="createForm.reorder_level" required type="number" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" @click="isCreateModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Save Material</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Material Modal -->
        <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Edit Material Details</h3>
                    <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitEdit" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-2">Material / Item Name</label>
                        <input v-model="editForm.name" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Unit Type</label>
                            <input v-model="editForm.unit" required type="text" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Unit Price (৳)</label>
                            <input v-model="editForm.price" required type="number" step="0.01" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-700 mb-2">Current Quantity</label>
                            <input v-model="editForm.quantity" required type="number" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-slate-700 mb-2">Reorder Alert Level</label>
                            <input v-model="editForm.reorder_level" required type="number" min="0" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" @click="isEditModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                        <button type="submit" :disabled="editForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Update Material</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Adjust Stock Modal -->
        <div v-if="isAdjustModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Adjust Inventory Level</h3>
                        <p class="text-xs text-blue-600 font-extrabold mt-1">{{ selectedMaterial?.name }}</p>
                    </div>
                    <button @click="isAdjustModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitAdjust" class="space-y-5 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 mb-3">Adjustment Type</label>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="flex items-center justify-center gap-2.5 p-4 rounded-xl border cursor-pointer transition-all font-extrabold uppercase tracking-wider" :class="adjustForm.type === 'add' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'">
                                <input v-model="adjustForm.type" type="radio" value="add" class="hidden" />
                                <span>Restock (Add)</span>
                            </label>
                            <label class="flex items-center justify-center gap-2.5 p-4 rounded-xl border cursor-pointer transition-all font-extrabold uppercase tracking-wider" :class="adjustForm.type === 'consume' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-600'">
                                <input v-model="adjustForm.type" type="radio" value="consume" class="hidden" />
                                <span>Consume (Use)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-700 mb-2">Quantity ({{ selectedMaterial?.unit }})</label>
                        <input v-model="adjustForm.amount" required type="number" min="1" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 outline-none transition-all" />
                        <span v-if="adjustForm.errors.amount" class="text-xs text-rose-600 font-bold mt-2 block">{{ adjustForm.errors.amount }}</span>
                    </div>

                    <div class="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" @click="isAdjustModalOpen = false" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all">Cancel</button>
                        <button type="submit" :disabled="adjustForm.processing" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">Submit Adjustment</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
