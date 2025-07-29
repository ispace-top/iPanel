import fs from 'fs/promises';
import path from 'path';

// 定义导航项和应用配置的接口
export interface NavItem {
    name: string;
    url: string;
    icon: string;
}

export interface AppConfig {
    cities: string[];
    navItems: NavItem[];
}

// 配置文件路径
const configPath = path.join(process.cwd(), 'config.json');

/**
 * 获取当前配置
 * @returns {Promise<AppConfig>} 配置对象
 */
export const getConfig = async (): Promise<AppConfig> => {
    try {
        const data = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // 如果配置文件不存在，则创建一个默认的
        console.warn("config.json not found, creating a default one.");
        const defaultConfig: AppConfig = {
            cities: ['beijing'],
            navItems: [
                { name: 'Example Site', url: '#', icon: 'globe' }
            ]
        };
        await saveConfig(defaultConfig);
        return defaultConfig;
    }
};

/**
 * 保存配置
 * @param {AppConfig} config - 新的配置对象
 */
export const saveConfig = async (config: AppConfig): Promise<void> => {
    try {
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error saving config:", error);
        throw error;
    }
};
