import "./App.css";
import { Book } from "./features/Book/Book.tsx";
import { BookDataProvider } from "./features/Book/BookDataProvider.tsx";

export function App() {
  return (
    <BookDataProvider>
      <div>
        <Book />
      </div>
    </BookDataProvider>
  );
}
