import { EventBus } from '../core/event-bus.ts';
import HttpTransport from '../core/http-transport.ts';

const RegistrationApi = new HttpTransport();

export class RegistrationModel extends EventBus {
  async registration(data: Record<string, unknown>) {
    return RegistrationApi.post('/auth/signup', { data });
  }
}
