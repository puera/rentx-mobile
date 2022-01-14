import { ValidationError } from 'yup';

export function formatMessagesYup(messages: ValidationError) {
  let message = '';
  messages.errors.forEach((err) => {
    message += `${err}\n`;
  });

  return message;
}
