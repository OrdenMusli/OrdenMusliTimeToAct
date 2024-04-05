"use client"; // Markiert den Code als Client-seitig und wird von Vercel verwendet, um den Code nur im Browser auszuführen.

import { Button } from "@/components/ui/button"; // Importiert die Button-Komponente aus dem UI-Verzeichnis.
import { Input } from "@/components/ui/input"; // Importiert die Input-Komponente aus dem UI-Verzeichnis.
import { toggleComplete } from "@/lib/actions";
import { Plus, X, Edit, CheckCircle, Key } from "lucide-react"; // Importiert verschiedene Icons aus dem lucide-react-Paket.
import { useState, useEffect } from "react"; // Importiert useState und useEffect Hooks von React.

// Todo-Komponente, die ein einzelnes Todo-Element darstellt.
const Todo = ({ todo, onDelete, onToggle, onEdit }) => {
  const [editing, setEditing] = useState(false); // Zustand für den Bearbeitungsmodus des Todos.
  const [editedText, setEditedText] = useState(todo.text); // Zustand für den bearbeiteten Text des Todos.

  // Funktion, um in den Bearbeitungsmodus zu wechseln.
  const handleEdit = () => {
    setEditing(true);
  };

  // Funktion, um die Bearbeitungen zu speichern.
  const handleSave = () => {
    onEdit(todo.key, editedText); // Aufruf der Editierfunktion mit dem Schlüssel und dem bearbeiteten Text.
    setEditing(false); // Beenden des Bearbeitungsmodus.
  };

  return (
    <div
      className={`border-2 p-4 mt-2 flex flex-row ${
        todo.completed ? "bg-gray-200" : ""
      }`}
    >
      {editing ? ( // Anzeige des Inputs im Bearbeitungsmodus oder des Textes im Lesemodus.
        <Input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <div
          onClick={onToggle}
          style={{ textDecoration: todo.completed ? "line-through" : "none" }}
        >
          {todo.text}
        </div>
      )}
      <div className="ml-auto">
        <Button
          className="ml-auto bg-blue-800"
          onClick={editing ? handleSave : handleEdit}
        >
          {editing ? <Plus /> : <Edit />}
        </Button>
        <Button className="ml-2 bg-green-800" onClick={onToggle}>
          <CheckCircle />
        </Button>
        <Button className="ml-2 bg-red-800" onClick={() => onDelete(todo.key)}>
          <X />
        </Button>
      </div>
    </div>
  );
};

// Typdefinition für ein einzelnes Todo.
interface Todo {
  text: string;
  completed: boolean;
  key: string;
}

// Die Home-Komponente, die die Hauptseite der Anwendung darstellt.
export default function Home() {
  const todoKey = "todos"; // Schlüssel für den Local Storage.
  const [todos, setTodos] = useState<Todo[]>([]); // Zustand für die Liste der Todos.
  const [inputValue, setInputValue] = useState(""); // Zustand für den Eingabewert.

  // Funktion, um die Todos vom Server zu laden.
  const getTodos = () => {
    return fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  };

  useEffect(() => {
    getTodos(); // Beim ersten Rendern die Todos laden.
  }, []);

  // Funktion, um ein neues Todo hinzuzufügen.
  const addTodo = () => {
    const key = new Date().getTime() + inputValue; // Generiere einen eindeutigen Schlüssel.
    const newTodo = { text: inputValue, completed: false, key }; // Erstelle ein neues Todo-Objekt.
    fetch("/api", { method: "POST", body: JSON.stringify(newTodo) }) // Sende POST-Anfrage an die API.
      .then(() => getTodos()) // Nach dem Hinzufügen die Todos aktualisieren.
      .catch((error) => console.error("Error adding todo:", error)); // Fehlerbehandlung.
    setInputValue(""); // Input-Wert zurücksetzen.
  };

  // Funktion, um ein Todo zu bearbeiten.
  const editTodo = (key: string, newText: string) => {
    const todoIndex = todos.findIndex((todo) => todo.key === key); // Finde den Index des Todos.
    if (todoIndex === -1) return; // Wenn das Todo nicht gefunden wurde, abbrechen.

    const newTodos = [...todos]; // Kopiere die Todo-Liste.
    newTodos[todoIndex] = { ...newTodos[todoIndex], text: newText }; // Aktualisiere das Textfeld des Todos.

    fetch(`/api/${key}`, {
      // Sende PUT-Anfrage an die API, um das Todo zu aktualisieren.
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
        setTodos(newTodos); // Aktualisiere die lokale Todo-Liste.
        localStorage.setItem(todoKey, JSON.stringify(newTodos)); // Aktualisiere den Local Storage.
      })
      .catch((error) => {
        console.error("Error updating todo:", error); // Fehlerbehandlung.
      });
  };

  // Funktion, um ein Todo zu löschen.
  const removeTodo = (key: string) => {
    console.log("Deleting todo with key:", key);

    fetch(`/api/${key}`, { method: "DELETE" }) // Sende DELETE-Anfrage an die API.
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        const newTodos = todos.filter((todo) => todo.key !== key); // Filtere das gelöschte Todo aus der Liste.
        setTodos(newTodos); // Aktualisiere die lokale Todo-Liste.
        localStorage.setItem(todoKey, JSON.stringify(newTodos)); // Aktualisiere den Local Storage.
      })
      .catch((error) => console.error("Error deleting todo:", error)); // Fehlerbehandlung.
  };

  // Funktion, um ein Todo als erledigt zu markieren oder als nicht erledigt zu markieren.
  const toggleTodo = (key: string) => {
    const todoIndex = todos.findIndex((todo) => todo.key === key); // Finde den Index des Todos.
    if (todoIndex === -1) return; // Wenn das Todo nicht gefunden wurde, abbrechen.

    const newTodos = [...todos]; // Kopiere die Todo-Liste.
    const todo = newTodos[todoIndex]; // Finde das entsprechende Todo.
    newTodos[todoIndex] = { ...todo, completed: !todo.completed }; // Aktualisiere den Status des Todos.
    toggleComplete(key, !todo.completed)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to toggle todo");
        }
        setTodos(newTodos); // Aktualisiere die lokale Todo-Liste.
        localStorage.setItem(todoKey, JSON.stringify(newTodos)); // Aktualisiere den Local Storage.
      })
      .catch((error) => {
        console.error("Error toggling todo:", error); // Fehlerbehandlung.
      });
  };

  return (
    <main className="flex">
      <div className="w-full  m-4 ">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ToDo"
          />
          <Button
            type="submit"
            onClick={addTodo}
            className="ml-auto bg-green-500"
          >
            <Plus />
          </Button>
        </div>

        <div>
          {todos.map(
            (
              todo // Durchlaufe die Liste der Todos und rendere jedes Todo.
            ) => (
              <Todo
                key={todo.key}
                todo={todo}
                onDelete={removeTodo}
                onToggle={() => toggleTodo(todo.key)}
                onEdit={editTodo}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
