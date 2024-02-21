<script lang="ts">
	import { browser } from "$app/environment";
  import "../app.css";
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>