// Dipakai bersama oleh chart Astrology & Human Design.
/** Ekspor elemen <svg> chart ke PNG 2x berlatar hitam (glyph <image> di-inline sebagai data URI). */
export async function downloadSvgAsPng(svg: SVGSVGElement, filename: string) {
  const vb = svg.viewBox.baseVal;
  const scale = 2;
  const w = vb.width * scale;
  const h = vb.height * scale;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));

  await Promise.all(
    Array.from(clone.querySelectorAll('image')).map(async (img) => {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href');
      if (!href || href.startsWith('data:')) return;
      const blob = await (await fetch(href)).blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      img.setAttribute('href', dataUrl);
      img.removeAttribute('xlink:href');
    })
  );

  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0, w, h);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
