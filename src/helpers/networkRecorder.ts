import { Page, Request, Response } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export interface INetworkRecord {
  id: string;
  timestamp: number;
  durationMs: number;
  url: string;
  method: string;
  status: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  resourceType: string;
}

/**
 * Network Recorder - captures all XHR/fetch requests during test execution
 * Stores data in test-results/<test-id>/network/xhr-log.json
 * Provides methods to query captured network traffic
 */
export class NetworkRecorder {
  private readonly records: Map<string, INetworkRecord> = new Map();
  private readonly requestStartTimes: Map<string, number> = new Map();
  private readonly page: Page;
  private readonly testId: string;
  private readonly outputDir: string;
  private isRecording: boolean = false;

  constructor(page: Page, testId: string) {
    this.page = page;
    this.testId = testId;
    this.outputDir = path.resolve(process.cwd(), 'test-results', testId, 'network');
  }

  /**
   * Start recording network traffic
   */
  start(): void {
    if (this.isRecording) {
      return;
    }

    this.isRecording = true;
    Logger.debug('Network recording started');

    // Listen to requests
    this.page.on('request', (request: Request) => {
      const resourceType = request.resourceType();
      if (resourceType === 'xhr' || resourceType === 'fetch') {
        this.requestStartTimes.set(request.url(), Date.now());
      }
    });

    // Listen to responses
    this.page.on('response', async (response: Response) => {
      const request = response.request();
      const resourceType = request.resourceType();
      
      if (resourceType === 'xhr' || resourceType === 'fetch') {
        await this.captureResponse(response);
      }
    });
  }

  /**
   * Stop recording and save to file
   */
  async stop(): Promise<void> {
    if (!this.isRecording) {
      return;
    }

    this.isRecording = false;
    await this.saveToFile();
    Logger.debug(`Network recording stopped. Captured ${this.records.size} requests`);
  }

  /**
   * Capture response data
   */
  private async captureResponse(response: Response): Promise<void> {
    const request = response.request();
    const url = request.url();
    const startTime = this.requestStartTimes.get(url) || Date.now();
    const durationMs = Date.now() - startTime;

    try {
      // Get request headers (mask sensitive data)
      const requestHeaders = this.maskSensitiveHeaders(request.headers());

      // Get response headers
      const responseHeaders = response.headers();

      // Get request body (if text-based)
      let requestBody: string | undefined;
      try {
        const postData = request.postData();
        if (postData) {
          requestBody = this.maskSensitiveData(postData);
        }
      } catch (e) {
        // Ignore errors reading request body
      }

      // Get response body (if text-based)
      let responseBody: string | undefined;
      try {
        const contentType = responseHeaders['content-type'] || '';
        if (contentType.includes('application/json') || 
            contentType.includes('text/') ||
            contentType.includes('application/xml')) {
          responseBody = await response.text();
          responseBody = this.maskSensitiveData(responseBody);
        }
      } catch (e) {
        // Ignore errors reading response body
      }

      const record: INetworkRecord = {
        id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
        timestamp: startTime,
        durationMs,
        url,
        method: request.method(),
        status: response.status(),
        requestHeaders,
        responseHeaders,
        requestBody,
        responseBody,
        resourceType: request.resourceType(),
      };

      this.records.set(url, record);
    } catch (error) {
      Logger.warn(`Failed to capture response for ${url}`, error as Error);
    }
  }

  /**
   * Mask sensitive headers
   */
  private maskSensitiveHeaders(headers: Record<string, string>): Record<string, string> {
    const masked: Record<string, string> = { ...headers };
    const sensitiveKeys = ['authorization', 'cookie', 'x-auth-token', 'x-api-key', 'x-access-token'];
    
    for (const key of Object.keys(masked)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        masked[key] = '[MASKED]';
      }
    }
    
    return masked;
  }

  /**
   * Mask sensitive data in body
   */
  private maskSensitiveData(data: string): string {
    try {
      const json = JSON.parse(data);
      const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret'];
      
      const maskObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) {
          return obj;
        }
        
        if (Array.isArray(obj)) {
          return obj.map(maskObject);
        }
        
        const masked: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const lowerKey = key.toLowerCase();
          if (sensitiveFields.some(sf => lowerKey.includes(sf))) {
            masked[key] = '[MASKED]';
          } else if (typeof value === 'object') {
            masked[key] = maskObject(value);
          } else {
            masked[key] = value;
          }
        }
        
        return masked;
      };
      
      return JSON.stringify(maskObject(json), null, 2);
    } catch {
      // Not JSON, return as is
      return data;
    }
  }

  /**
   * Save records to file
   */
  private async saveToFile(): Promise<void> {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      const filePath = path.join(this.outputDir, 'xhr-log.json');
      const data = Array.from(this.records.values());
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      Logger.debug(`Network log saved to ${filePath}`);
    } catch (error) {
      Logger.error('Failed to save network log', error as Error);
    }
  }

  /**
   * Get all records
   */
  getRecords(): INetworkRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get requests by URL pattern
   */
  getRequestsByUrl(pattern: string | RegExp): INetworkRecord[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.getRecords().filter(record => regex.test(record.url));
  }

  /**
   * Get responses by URL pattern
   */
  getResponsesByUrl(pattern: string | RegExp): INetworkRecord[] {
    return this.getRequestsByUrl(pattern);
  }

  /**
   * Get last response for URL pattern
   */
  getLastResponse(urlPattern: string | RegExp): INetworkRecord | undefined {
    const matches = this.getRequestsByUrl(urlPattern);
    if (matches.length === 0) {
      return undefined;
    }
    return matches.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  /**
   * Check if request was called
   */
  expectRequestCalled(urlPattern: string | RegExp, options?: { times?: number }): void {
    const matches = this.getRequestsByUrl(urlPattern);
    const times = options?.times ?? 1;
    
    if (matches.length < times) {
      throw new Error(
        `Expected request matching ${urlPattern} to be called ${times} time(s), but was called ${matches.length} time(s)`
      );
    }
  }

  /**
   * Check if recorder has data
   */
  hasData(): boolean {
    return this.records.size > 0;
  }

  /**
   * Get data for Allure attachment
   */
  getData(): INetworkRecord[] {
    return this.getRecords();
  }
}

