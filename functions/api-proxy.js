export async function onRequest(context) {
  const { request, env, params } = context;
  
  // Get the backend URL from environment variables or use default
  const backendUrl = env.API_BASE_URL || 'https://presensi.sigmath.net/api';
  
  // Extract the path from the request
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const queryString = url.search;
  
  // Construct the target URL
  const targetUrl = `${backendUrl}${path}${queryString}`;
  
  // Create a new request with the same method, headers, and body
  const targetRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });
  
  // Remove the host header to avoid conflicts
  targetRequest.headers.delete('host');
  
  try {
    // Forward the request to the backend
    const response = await fetch(targetRequest);
    
    // Create a new response with the backend's response
    const proxyResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
    
    // Add CORS headers if needed
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return proxyResponse;
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ 
      error: 'Proxy Error', 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}