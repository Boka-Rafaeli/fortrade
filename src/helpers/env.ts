import * as path from 'path';
import * as fs from 'fs';

export type Environment = 'dev' | 'stage' | 'prod';

export interface IEnvConfig {
  baseURL: string;
  apiBaseURL: string;
  env: Environment;
  // Add other environment-specific configs as needed
  [key: string]: string | Environment;
}

/**
 * Simple env file parser (without dotenv dependency)
 */
function parseEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  
  if (!fs.existsSync(filePath)) {
    return env;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }

  return env;
}

/**
 * Loads environment configuration from .env files
 * Priority: process.env > .env file > default
 */
export function loadEnvConfig(env: Environment = 'dev'): IEnvConfig {
  // Determine env from process.env or default to dev
  const targetEnv = (process.env.ENV as Environment) || env;

  // Load base .env if exists
  const baseEnvPath = path.resolve(process.cwd(), '.env');
  const baseEnv = parseEnvFile(baseEnvPath);
  Object.assign(process.env, baseEnv);

  // Load env-specific .env file
  const envFilePath = path.resolve(process.cwd(), `src/config/env/${targetEnv}.env`);
  const envFile = parseEnvFile(envFilePath);
  Object.assign(process.env, envFile);

  // Build config object with defaults
  const config: IEnvConfig = {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    apiBaseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
    env: targetEnv,
  };

  // Merge any additional env vars
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('E2E_')) {
      config[key.replace('E2E_', '').toLowerCase()] = process.env[key] || '';
    }
  });

  return config;
}

/**
 * Get current environment configuration
 */
export function getEnvConfig(): IEnvConfig {
  return loadEnvConfig();
}

