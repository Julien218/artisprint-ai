import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, file_urls = [], size = '1024x1024', quality = 'standard' } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return Response.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    // If reference images are provided, use gpt-image-1 (supports image editing with references)
    // Otherwise use dall-e-3 for pure generation
    let imageUrl;

    if (file_urls.length > 0) {
      // Use gpt-image-1 which supports multi-modal (image + text) generation
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', prompt);
      formData.append('n', '1');
      formData.append('size', size);
      formData.append('quality', quality === 'hd' ? 'high' : 'medium');

      // Fetch and attach each reference image
      for (let i = 0; i < file_urls.length; i++) {
        const imgRes = await fetch(file_urls[i]);
        const imgBlob = await imgRes.blob();
        const ext = file_urls[i].split('?')[0].split('.').pop() || 'png';
        formData.append('image[]', imgBlob, `ref_${i}.${ext}`);
      }

      const res = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: data.error?.message || 'OpenAI error' }, { status: res.status });
      }

      // gpt-image-1 returns base64
      const b64 = data.data?.[0]?.b64_json;
      if (!b64) {
        return Response.json({ error: 'No image returned' }, { status: 500 });
      }

      // Upload base64 to storage via base44
      const binaryStr = atob(b64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/png' });

      const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file: blob });
      imageUrl = file_url;

    } else {
      // Pure generation with DALL-E 3 (fastest, highest quality text-to-image)
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality,
          response_format: 'url',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: data.error?.message || 'OpenAI error' }, { status: res.status });
      }

      imageUrl = data.data?.[0]?.url;
      if (!imageUrl) {
        return Response.json({ error: 'No image returned' }, { status: 500 });
      }
    }

    return Response.json({ image_url: imageUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});