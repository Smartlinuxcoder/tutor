<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let isDark = $state(false);

	onMount(() => {
		// Leggi il cookie per il tema
		const themeCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('theme='));
		
		if (themeCookie) {
			isDark = themeCookie.split('=')[1] === 'dark';
		} else {
			// Controlla la preferenza del sistema
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		
		applyTheme();
	});

	function applyTheme() {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function toggleTheme() {
		isDark = !isDark;
		applyTheme();
		// Salva nel cookie (1 anno)
		document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Theme Toggle Button -->
	<button
		onclick={toggleTheme}
		class="fixed top-4 right-4 z-50 glass-card rounded-md p-3 transition-all hover:scale-110"
		aria-label="Toggle theme"
	>
		{#if isDark}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
			</svg>
		{/if}
	</button>

	<!-- Main Content -->
	<main class="flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="glass-card mt-auto py-4 text-center">
		<p class="text-sm" style="color: var(--text-muted);">
			Sito realizzato e amministrato da Giulio Randazzo
		</p>
	</footer>
</div>
