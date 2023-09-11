<script lang="ts">
  import "../app.css";
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
</script>

<svelte:head>
  <title>Ngaji Yuk</title>
</svelte:head>

<div class="select-none container max-w-lg mx-auto min-h-screen bg-neutral-100">
  <slot />
</div>