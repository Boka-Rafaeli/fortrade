import { allure } from 'allure-playwright';

/**
 * Step decorator for Allure reporting
 * Wraps method execution in an Allure step
 */
export function step<T extends (...args: any[]) => Promise<any>>(
  stepName: string
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = async function (...args: any[]) {
      return await allure.step(stepName, async () => {
        return await originalMethod.apply(this, args);
      });
    } as T;

    return descriptor;
  };
}

/**
 * Attachment decorator for Allure
 * Attaches result of method execution as attachment
 */
export function attach<T extends (...args: any[]) => Promise<any>>(
  attachmentName: string,
  attachmentType: 'text' | 'json' | 'html' = 'text'
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      const content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      
      await allure.attachment(attachmentName, content, {
        contentType: attachmentType === 'json' ? 'application/json' : 
                     attachmentType === 'html' ? 'text/html' : 'text/plain',
      });

      return result;
    } as T;

    return descriptor;
  };
}

