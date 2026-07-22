<script setup>
defineProps({
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: ''
    },
    compact: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <!-- Official BSRM Steels Logo -->
    <div v-if="name === 'bsrm'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/6/63/BSRM_Logo.svg/512px-BSRM_Logo.svg.png" 
            alt="BSRM Steels Logo" 
            :class="compact ? 'h-5 w-auto object-contain shrink-0' : 'h-8 w-auto object-contain shrink-0'" 
            @error="(e) => e.target.style.display = 'none'"
        />
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black tracking-tight text-red-600 uppercase' : 'text-sm font-black tracking-tight text-red-600 uppercase'">BSRM</span>
            <span v-if="!compact" class="text-[9px] font-extrabold text-blue-900 tracking-widest uppercase mt-0.5">STEELS LIMITED</span>
        </div>
    </div>

    <!-- Official LafargeHolcim / Holcim Logo -->
    <div v-else-if="name === 'lafarge'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Holcim_logo.svg/512px-Holcim_logo.svg.png" 
            alt="Holcim Lafarge Logo" 
            :class="compact ? 'h-4 w-auto object-contain shrink-0' : 'h-7 w-auto object-contain shrink-0'" 
            @error="(e) => e.target.style.display = 'none'"
        />
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black tracking-tight text-teal-700' : 'text-sm font-black tracking-tight text-teal-700'">LafargeHolcim</span>
            <span v-if="!compact" class="text-[9px] font-bold text-slate-500 tracking-wider mt-0.5">Building Progress</span>
        </div>
    </div>

    <!-- Official Seven Rings Cement Logo -->
    <div v-else-if="name === 'sevenrings'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <!-- Authentic Seven Rings Emblem -->
        <div :class="compact ? 'w-5 h-5 relative flex items-center justify-center shrink-0' : 'w-7 h-7 relative flex items-center justify-center shrink-0'">
            <svg class="w-full h-full text-amber-500" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="6" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
            </svg>
        </div>
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black tracking-tight text-amber-700 uppercase' : 'text-sm font-black tracking-tight text-amber-700 uppercase'">SEVEN RINGS</span>
            <span v-if="!compact" class="text-[9px] font-extrabold text-slate-700 tracking-widest uppercase mt-0.5">CEMENT</span>
        </div>
    </div>

    <!-- Official Mir Concrete Logo -->
    <div v-else-if="name === 'mir'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <div :class="compact ? 'px-1.5 py-0.5 rounded-md bg-blue-800 text-white font-black text-[10px] shadow-sm tracking-tighter shrink-0 border border-blue-900' : 'px-2 py-1 rounded-lg bg-blue-800 text-white font-black text-xs shadow-sm tracking-tighter shrink-0 border border-blue-900'">
            MIR
        </div>
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black text-blue-900 tracking-tight uppercase' : 'text-sm font-black text-blue-900 tracking-tight uppercase'">MIR CONCRETE</span>
            <span v-if="!compact" class="text-[9px] font-bold text-blue-600 tracking-wider mt-0.5">ReadyMix Products</span>
        </div>
    </div>

    <!-- Official Berger Paints Logo -->
    <div v-else-if="name === 'berger'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Berger_Paints_logo.svg/512px-Berger_Paints_logo.svg.png" 
            alt="Berger Paints Logo" 
            :class="compact ? 'h-4 w-auto object-contain shrink-0' : 'h-7 w-auto object-contain shrink-0'" 
            @error="(e) => e.target.style.display = 'none'"
        />
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black tracking-tight text-indigo-900' : 'text-sm font-black tracking-tight text-indigo-900'">Berger</span>
            <span v-if="!compact" class="text-[9px] font-extrabold text-rose-600 tracking-widest uppercase mt-0.5">PAINTS BANGLADESH</span>
        </div>
    </div>

    <!-- Official Caterpillar CAT Logo -->
    <div v-else-if="name === 'cat'" :class="['flex items-center gap-2 select-none shrink-0', className]">
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Caterpillar_logo.svg/512px-Caterpillar_logo.svg.png" 
            alt="Caterpillar CAT Logo" 
            :class="compact ? 'h-4 w-auto object-contain shrink-0' : 'h-7 w-auto object-contain shrink-0'" 
            @error="(e) => e.target.style.display = 'none'"
        />
        <div class="flex flex-col justify-center leading-none">
            <span :class="compact ? 'text-xs font-black tracking-tighter text-slate-900 uppercase' : 'text-sm font-black tracking-tighter text-slate-900 uppercase'">CATERPILLAR</span>
            <span v-if="!compact" class="text-[9px] font-extrabold text-yellow-600 tracking-wider uppercase mt-0.5">Heavy Equipment</span>
        </div>
    </div>

    <!-- Official SmartConstruct Crane & Building Logo -->
    <div v-else class="flex items-center select-none shrink-0">
        <img 
            src="/images/logo.png" 
            alt="SmartConstruct Logo" 
            :class="[className || 'h-14 sm:h-16 lg:h-20 w-auto object-contain shrink-0']" 
        />
    </div>
</template>
