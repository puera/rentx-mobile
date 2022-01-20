/* eslint-disable @typescript-eslint/no-empty-interface */
import { AppRoutesParamList } from '../../routes/app.stack.routes';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppRoutesParamList {}
  }
}
