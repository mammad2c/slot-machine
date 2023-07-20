import { render } from "@testing-library/vue";
import type { RenderOptions, RenderResult } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createVuetify } from "vuetify";
import { createTestingPinia } from "@pinia/testing";
import type { UserEvent } from "node_modules/@testing-library/user-event/dist/types/setup/setup";

const renderComponent = (
  component: unknown,
  renderOptions: RenderOptions = {},
): RenderResult & { user: UserEvent } => {
  const vuetify = createVuetify();
  const user = userEvent.setup();

  const renderTools = render(component, {
    global: {
      plugins: [vuetify, createTestingPinia({ stubActions: false })],
    },
    ...renderOptions,
  });

  return { ...renderTools, user };
};

export { renderComponent };
