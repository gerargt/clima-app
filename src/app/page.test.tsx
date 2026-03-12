import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./page";

type MockedResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

const createMockResponse = (body: unknown, status = 200): MockedResponse => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Home weather page", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("muestra la información del clima después de una búsqueda exitosa", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createMockResponse({
        searched: "San Salvador, SV",
        weather: {
          temp: 28,
          humidity: 72,
          desc: "Parcialmente nublado",
          feelsLike: 31,
          icon: "03n",
        },
      }),
    );

    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/escribe una ciudad/i),
      "San Salvador",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(await screen.findByText("San Salvador, SV")).toBeInTheDocument();
    expect(screen.getByText("Parcialmente nublado")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("31°C")).toBeInTheDocument();
  });

  it("muestra error cuando se ingresa una ciudad invalida", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      createMockResponse(
        { error: "Ciudad no encontrada. Intenta con otro nombre." },
        404,
      ),
    );

    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/escribe una ciudad/i),
      "xxxxxzzzzz",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      await screen.findByText(
        /Ciudad no encontrada\. Verifica el nombre e intenta de nuevo\./i,
      ),
    ).toBeInTheDocument();
  });

  it("permite escribir en el input y usar el botón para buscar", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createMockResponse({
        searched: "Madrid, ES",
        weather: {
          temp: 21,
          humidity: 40,
          desc: "Despejado",
          feelsLike: 21,
          icon: "01d",
        },
      }),
    );

    renderWithProviders(<Home />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/escribe una ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "Madrid");
    expect(input).toHaveValue("Madrid");

    await user.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/weather?city=Madrid",
      );
    });
  });

  it("muestra validación cuando el campo ciudad está vacío", async () => {
    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      screen.getByText(/Escribe una ciudad para consultar el clima\./i),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("muestra validación cuando la ciudad tiene menos de 2 caracteres", async () => {
    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/escribe una ciudad/i),
      "a",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      screen.getByText(
        /El nombre de la ciudad debe tener al menos 2 caracteres\./i,
      ),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("muestra error cuando la respuesta del servidor no es JSON valido", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/escribe una ciudad/i),
      "Madrid",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      await screen.findByText(/Respuesta inválida del servidor\./i),
    ).toBeInTheDocument();
  });

  it("muestra el error enviado por el backend cuando falla con estado distinto de 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      createMockResponse(
        { error: "No se pudo consultar el clima." },
        502,
      ),
    );

    renderWithProviders(<Home />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/escribe una ciudad/i),
      "Madrid",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      await screen.findByText(/No se pudo consultar el clima\./i),
    ).toBeInTheDocument();
  });

  it("permite buscar presionando Enter en el campo de entrada", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createMockResponse({
        searched: "Madrid, ES",
        weather: {
          temp: 21,
          humidity: 40,
          desc: "Despejado",
          feelsLike: 21,
          icon: "01d",
        },
      }),
    );

    renderWithProviders(<Home />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/escribe una ciudad/i);

    await user.type(input, "Madrid{enter}");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/weather?city=Madrid",
      );
    });
  });
});
