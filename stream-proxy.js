/**
 * Cloudflare Edge Proxy for IPTV / HLS / Media Streams
 * File: stream-proxy.js
 * 
 * Features:
 * 1. Converts HTTP media streams to HTTPS to eliminate mixed-content errors.
 * 2. Injects Access-Control-Allow-Origin: * and full CORS headers.
 * 3. Supports User-Agent and Referer masking via query parameters or defaults.
 * 4. Relays Range headers to support video seeking and chunk loading.
 * 5. Intelligently rewrites relative URLs in .m3u8 manifests so segment requests stay proxied.
 */

const worker = {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Referer, Range, Authorization',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const workerUrl = new URL(request.url);
    const targetUrlParam = workerUrl.searchParams.get('url');

    if (!targetUrlParam) {
      return new Response(
        JSON.stringify({
          error: 'Missing required "url" parameter',
          usage: `${workerUrl.origin}/?url=http://example.com/stream.m3u8&ua=CustomUA&referer=http://example.com`,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders,
          },
        }
      );
    }

    try {
      const targetUrl = new URL(targetUrlParam);

      // Custom Header Masking
      const customUserAgent = workerUrl.searchParams.get('ua') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
      const customReferer = workerUrl.searchParams.get('referer') || `${targetUrl.protocol}//${targetUrl.host}/`;

      // Build Proxy Headers
      const proxyRequestHeaders = new Headers();
      proxyRequestHeaders.set('User-Agent', customUserAgent);
      proxyRequestHeaders.set('Referer', customReferer);
      proxyRequestHeaders.set('Accept', '*/*');
      proxyRequestHeaders.set('Accept-Language', 'en-US,en;q=0.9,bn;q=0.8');

      // Forward Range Header for seeking / byte-range media requests
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        proxyRequestHeaders.set('Range', rangeHeader);
      }

      // Fetch Upstream Media Stream
      const originResponse = await fetch(targetUrl.toString(), {
        method: request.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: proxyRequestHeaders,
        redirect: 'follow',
      });

      const contentType = originResponse.headers.get('Content-Type') || '';
      const responseHeaders = new Headers(originResponse.headers);

      // Inject CORS and Security Headers
      Object.entries(corsHeaders).forEach(([key, val]) => {
        responseHeaders.set(key, val);
      });

      // Remove restrictive headers if present
      responseHeaders.delete('X-Frame-Options');
      responseHeaders.delete('Content-Security-Policy');

      // 2. Handle .m3u8 Playlist Manifest Rewriting
      const isM3u8 = targetUrl.pathname.endsWith('.m3u8') || 
                     contentType.includes('mpegurl') || 
                     contentType.includes('m3u8') ||
                     targetUrlParam.includes('.m3u8');

      if (isM3u8 && originResponse.ok && request.method === 'GET') {
        const originalText = await originResponse.text();
        const proxyBaseUrl = `${workerUrl.origin}${workerUrl.pathname}`;

        // Parse and rewrite relative lines in M3U8 manifest
        const rewrittenManifest = originalText
          .split('\n')
          .map((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
              // Check for URI inside tags like #EXT-X-KEY:METHOD=AES-128,URI="key.key"
              if (trimmed.startsWith('#EXT-X-KEY') || trimmed.startsWith('#EXT-X-MAP')) {
                return trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
                  const absoluteUri = new URL(uri, targetUrl.href).href;
                  const proxiedUri = `${proxyBaseUrl}?url=${encodeURIComponent(absoluteUri)}&ua=${encodeURIComponent(customUserAgent)}&referer=${encodeURIComponent(customReferer)}`;
                  return `URI="${proxiedUri}"`;
                });
              }
              return line;
            }

            // Resolve relative segment/playlist URL to absolute
            const absoluteSegmentUrl = new URL(trimmed, targetUrl.href).href;
            return `${proxyBaseUrl}?url=${encodeURIComponent(absoluteSegmentUrl)}&ua=${encodeURIComponent(customUserAgent)}&referer=${encodeURIComponent(customReferer)}`;
          })
          .join('\n');

        responseHeaders.set('Content-Type', 'application/x-mpegURL; charset=utf-8');
        responseHeaders.set('Cache-Control', 'public, max-age=5');

        return new Response(rewrittenManifest, {
          status: originResponse.status,
          headers: responseHeaders,
        });
      }

      // 3. Return Raw Stream / Media Segment (.ts, .m4s, .mp4, etc.)
      responseHeaders.set('Cache-Control', 'public, max-age=3600');
      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders,
      });

    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'Edge Proxy Execution Error',
          message: err.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

export default worker;
