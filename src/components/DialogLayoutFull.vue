<template>
	<q-dialog
		v-model="props.is_show_dialog"
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
		class="no-scrool"
		backdrop-filter="blur(10px) "
		@keyup.esc="emit('hide')"
	>
		<div style="height: 65px" class="items-center row q-gutter-x-md overflow-hidden">
			<q-space />

			<slot name="top"></slot>

			<q-btn unelevated class="bg-white radius-10 q-py-sm" icon="mdi-close" @click="emit('hide')">
				<span class="q-px-sm">关闭</span>
				<q-badge class="bg-grey-4 text-bold text-grey-8">Esc</q-badge>
			</q-btn>
		</div>
		<!-- <div style="height: 1rem" class="bg-white"></div> -->

		<q-card class="justify-center no-scrool q-pb-xl bg-blue-grey-1">
			<div class="width_limit q-gutter-y-lg" :class="{ 'q-px-md': props.padding }">
				<slot></slot>
			</div>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['hide'])

const props = defineProps({
	is_show_dialog: { tyle: Boolean, default: false },
	padding: { type: Boolean, default: false },
})
</script>
