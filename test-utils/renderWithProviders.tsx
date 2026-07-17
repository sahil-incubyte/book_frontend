import { render } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockLink } from "@apollo/client/testing";
import { Provider } from "react-redux";
import type { ReactElement, ReactNode } from "react";
import { makeStore, type AppStore } from "@/lib/store/store";
import { NotificationProvider } from "@/app/notifications/NotificationProvider";

type RenderOptions = {
  store?: AppStore;
  mocks?: MockLink.MockedResponse[];
};

// Renders `ui` inside the same providers the real app uses. Returns the store so
// tests can seed or assert Redux state.
export function renderWithProviders(
  ui: ReactElement,
  { store = makeStore(), mocks = [] }: RenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ChakraProvider value={defaultSystem}>
        <MockedProvider mocks={mocks}>
          <Provider store={store}>
            <NotificationProvider>{children}</NotificationProvider>
          </Provider>
        </MockedProvider>
      </ChakraProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
