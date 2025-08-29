export const parseImages = (images: string | string[]): string[] => {
    if (Array.isArray(images)) return images;
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [images];
    } catch {
      return [images];
    }
  };
  
  export const normalizeImageUrl = (img: string): string =>
    img.startsWith("http") ? img : `http://127.0.0.1:8000/${img.replace(/^\/+/, "")}`;
  