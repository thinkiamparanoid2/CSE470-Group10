<script setup>
import { computed } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
    status: {
        type: String,
    },
});

const form = useForm({});

const submit = () => {
    form.post(route('verification.send'));
};

const verificationLinkSent = computed(
    () => props.status === 'verification-link-sent',
);
</script>

<template>
    <GuestLayout title="Verify your email" subtitle="One more step before you can access the console.">
        <Head title="Email Verification" />

        <div class="mb-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <p class="text-xs text-slate-400 leading-relaxed">
                Thanks for signing up! Before getting started, please verify your email address
                by clicking the link we sent you. If you didn't receive the email, we can send another.
            </p>
        </div>

        <div
            v-if="verificationLinkSent"
            class="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
        >
            A new verification link has been sent to your email address.
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <PrimaryButton
                class="w-full !py-3"
                :class="{ 'opacity-50': form.processing }"
                :disabled="form.processing"
            >
                Resend Verification Email
            </PrimaryButton>

            <Link
                :href="route('logout')"
                method="post"
                as="button"
                class="btn-ghost w-full"
            >
                Sign Out
            </Link>
        </form>
    </GuestLayout>
</template>
