/**
 * Загрузчик изображений с обработкой ошибок
 */
export const loadImage = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(src);
    };
    
    img.onerror = () => {
      // Если изображение не загрузилось, возвращаем placeholder
      const placeholder = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
          <rect fill="#1f2937" width="400" height="400"/>
          <text fill="#22c55e" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20">No Image</text>
        </svg>
      `)}`;
      resolve(placeholder);
    };
    
    // Пробуем загрузить изображение
    img.src = src;
    
    // Таймаут на случай, если изображение загружается слишком долго
    setTimeout(() => {
      if (!img.complete) {
        const placeholder = `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
            <rect fill="#1f2937" width="400" height="400"/>
            <text fill="#22c55e" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20">Loading...</text>
          </svg>
        `)}`;
        resolve(placeholder);
      }
    }, 5000);
  });
};

/**
 * Получить URL изображения с fallback
 */
export const getImageUrl = (url: string | undefined): string => {
  if (!url) {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <rect fill="#1f2937" width="400" height="400"/>
        <text fill="#22c55e" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20">No Image</text>
      </svg>
    `)}`;
  }
  
  // Если это уже data URI, возвращаем как есть
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Для Unsplash добавляем параметры для оптимизации
  if (url.includes('unsplash.com')) {
    // Убеждаемся, что URL содержит правильные параметры
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has('w')) {
      urlObj.searchParams.set('w', '400');
    }
    if (!urlObj.searchParams.has('h')) {
      urlObj.searchParams.set('h', '400');
    }
    if (!urlObj.searchParams.has('fit')) {
      urlObj.searchParams.set('fit', 'crop');
    }
    return urlObj.toString();
  }
  
  return url;
};

