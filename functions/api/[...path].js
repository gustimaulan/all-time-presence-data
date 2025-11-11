export async function onRequest(context) {
  const { request, env, params } = context;
  
  // Backend URL - can be configured in environment variables
  const backendUrl = 'https://presensi.sigmath.net/api';
  
  // Get the path from the request
  const path = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Construct the target URL
  const targetUrl = `${backendUrl}/${path}${queryString}`;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  try {
    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // Create a new response with the backend's response
    const proxyResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    // Add CORS headers
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return proxyResponse;
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Proxy Error', 
      message: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}