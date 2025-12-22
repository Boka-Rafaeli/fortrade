import { allure } from 'allure-playwright';

/**
 * Step decorator for Allure reporting
 * Wraps method execution in an Allure step
 */
export function step(stepName: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor?: PropertyDescriptor
  ): PropertyDescriptor | void {
    if (!descriptor) {
      return;
    }

    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return;
    }

    descriptor.value = async function (...args: any[]) {
      return await allure.step(stepName, async () => {
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}

/**
 * Attachment decorator for Allure
 * Attaches result of method execution as attachment
 */
export function attach(attachmentName: string, attachmentType: 'text' | 'json' | 'html' = 'text') {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor?: PropertyDescriptor
  ): PropertyDescriptor | void {
    if (!descriptor) {
      return;
    }

    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return;
    }

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      const content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      
      await allure.attachment(attachmentName, content, {
        contentType: attachmentType === 'json' ? 'application/json' : 
                     attachmentType === 'html' ? 'text/html' : 'text/plain',
      });

      return result;
    };

    return descriptor;
  };
}

