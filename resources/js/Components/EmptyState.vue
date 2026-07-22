<script setup>
defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    variant: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'success'].includes(v),
    },
});
</script>

<template>
    <div class="py-14 flex flex-col items-center justify-center text-center space-y-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
        <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center border"
            :class="variant === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-500'"
        >
            <slot name="icon" />
        </div>
        <div>
            <p class="text-sm font-semibold text-slate-300">{{ title }}</p>
            <p v-if="description" class="text-xs text-slate-500 mt-1 max-w-xs">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>
