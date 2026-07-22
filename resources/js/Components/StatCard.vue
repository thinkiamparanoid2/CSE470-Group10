<script setup>
defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    unit: { type: String, default: '' },
    accent: {
        type: String,
        default: 'blue',
        validator: (v) => ['blue', 'rose', 'emerald', 'indigo', 'teal', 'amber'].includes(v),
    },
    alert: { type: Boolean, default: false },
});

const accentMap = {
    blue: { icon: 'bg-blue-600/10 border-blue-500/20 text-blue-400', value: 'text-white' },
    rose: { icon: 'bg-rose-500/10 border-rose-500/20 text-rose-400', value: 'text-rose-400' },
    emerald: { icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', value: 'text-emerald-400' },
    indigo: { icon: 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400', value: 'text-white' },
    teal: { icon: 'bg-teal-600/10 border-teal-500/20 text-teal-400', value: 'text-white' },
    amber: { icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400', value: 'text-white' },
};
</script>

<template>
    <div class="surface-card-interactive p-5 group">
        <div class="flex items-center justify-between">
            <div>
                <span class="section-title">{{ label }}</span>
                <div
                    class="text-2xl font-extrabold mt-1.5 transition-colors"
                    :class="alert ? accentMap.rose.value : accentMap[accent].value"
                >
                    {{ value }}
                    <span v-if="unit" class="text-xs font-normal text-slate-500 ml-1">{{ unit }}</span>
                </div>
            </div>
            <div
                class="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                :class="alert ? accentMap.rose.icon : accentMap[accent].icon"
            >
                <slot name="icon" />
            </div>
        </div>
    </div>
</template>
