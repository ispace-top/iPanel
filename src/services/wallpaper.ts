import axios from 'axios';

interface BingWallpaperResponse {
    images: {
        url: string;
        title: string;
    }[];
}

export async function getBingWallpaper(): Promise<{ url: string; title: string }> {
    try {
        // Note: The 'n=1' parameter gets today's wallpaper. 'idx=0' is for the current day.
        // The cors-anywhere proxy is a common workaround for local development CORS issues.
        // For production, you might want a more robust solution on your server.
        const response = await axios.get<BingWallpaperResponse>('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
        
        if (response.data && response.data.images && response.data.images.length > 0) {
            const image = response.data.images[0];
            return {
                url: `https://www.bing.com${image.url}`,
                title: image.title
            };
        } else {
            throw new Error('No images found in Bing API response');
        }
    } catch (error) {
        console.error("Error fetching Bing wallpaper:", error);
        // Fallback to a default image in case of an error
        return {
            url: 'https://source.unsplash.com/random/1920x1080?nature,scenery',
            title: 'Default Scenery'
        };
    }
}
