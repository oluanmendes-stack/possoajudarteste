export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Check if this is an API request
    if (url.pathname.startsWith('/api/')) {
      // Proxy to the Cloudflare Worker
      const apiUrl = `https://posso-ajudar-production.possoajudar.workers.dev${url.pathname}${url.search}`;
      
      const response = await fetch(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      return response;
    }
    
    // Otherwise, serve static content
    return env.ASSETS.fetch(request);
  },
};
