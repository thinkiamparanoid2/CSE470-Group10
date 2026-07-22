<script setup>
defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
    showText: {
        type: Boolean,
        default: true,
    },
});

const iconSizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-11 h-11' };
const svgSizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
const textSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };
</script>

<template>
    <div class="flex items-center gap-3 group">
        <div
            :class="[
                iconSizes[size],
                'flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300',
            ]"
        >
            <svg :class="svgSizes[size]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </div>
        <span
            v-if="showText"
            :class="[textSizes[size], 'font-extrabold tracking-[0.15em] text-white uppercase']"
        >
            Smart<span class="text-blue-400 font-medium">Construct</span>
        </span>
    </div>
</template>
