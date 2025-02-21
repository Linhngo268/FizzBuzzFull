import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../pages/App";

// Mock fetch API
global.fetch = jest.fn();

const mockFetchGames = [
  {
    id: 1,
    gameName: "FizzBuzz",
    author: "John Doe",
    range: { min: 1, max: 100 },
    timer: 60,
    rules: [{ divisor: 3, word: "Fizz" }, { divisor: 5, word: "Buzz" }],
  },
];

const mockGameResponse = { number: 15 };

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});

describe("App Component", () => {
  test("renders the app and shows the create game button", () => {
    render(<App />);
    expect(screen.getByText(/FizzBuzz Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Create new Game/i)).toBeInTheDocument();
  });

  test("fetches and displays available games", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFetchGames,
    });

    render(<App />);

    expect(await screen.findByText(/Available Games/i)).toBeInTheDocument();
    expect(await screen.findByText(/FizzBuzz/i)).toBeInTheDocument();
  });

  test("allows creating a new game", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    userEvent.click(screen.getByText(/Create new Game/i));

    const gameNameInput = screen.getByPlaceholderText(/Game Name/i);
    const authorInput = screen.getByPlaceholderText(/Author/i);

    userEvent.type(gameNameInput, "Test Game");
    userEvent.type(authorInput, "Test Author");

    userEvent.click(screen.getByText(/Create Game/i));

    expect(fetch).toHaveBeenCalledWith("http://localhost:5001/api/Games/create-game", expect.anything());
  });

  test("starts the selected game and displays a number", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchGames,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameResponse,
      });

    render(<App />);

    userEvent.click(await screen.findByText(/Select Game/i));
    userEvent.click(await screen.findByText(/Start Game/i));

    expect(await screen.findByText(/Playing: FizzBuzz/i)).toBeInTheDocument();
    expect(await screen.findByText(/Number: 15/i)).toBeInTheDocument();
  });

  test("handles correct answer submission", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchGames,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ correct: true }),
      });

    render(<App />);

    userEvent.click(await screen.findByText(/Select Game/i));
    userEvent.click(await screen.findByText(/Start Game/i));

    const answerInput = screen.getByPlaceholderText(/Your Answer/i);
    userEvent.type(answerInput, "FizzBuzz");
    userEvent.click(screen.getByText(/Submit Answer/i));

    await waitFor(() =>
      expect(screen.getByText(/Correct!/i)).toBeInTheDocument()
    );
  });

  test("handles incorrect answer submission", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchGames,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ correct: false, expected: "Fizz" }),
      });

    render(<App />);

    userEvent.click(await screen.findByText(/Select Game/i));
    userEvent.click(await screen.findByText(/Start Game/i));

    const answerInput = screen.getByPlaceholderText(/Your Answer/i);
    userEvent.type(answerInput, "Buzz");
    userEvent.click(screen.getByText(/Submit Answer/i));

    await waitFor(() =>
      expect(screen.getByText(/Incorrect! The correct answer was Fizz/i)).toBeInTheDocument()
    );
  });

  test("deletes a game", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFetchGames,
    });

    render(<App />);

    userEvent.click(await screen.findByText(/Delete/i));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5001/api/Games/1`,
        expect.objectContaining({ method: "DELETE" })
      )
    );
  });
});
