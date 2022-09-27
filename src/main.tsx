import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import App from './App';
import Home from './routes/Home';
import Recipes, {loader as recipeListLoader} from './routes/Recipes';
import RecipeEditor, {loader as recipeLoader} from './routes/RecipeEditor';
import Ingredients, {loader as ingredientsLoader} from './routes/Ingredients';
import Containers, {loader as containersLoader} from './routes/Containers';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/recipes",
        loader: recipeListLoader,
        element: <Recipes />,
      },
      {
        path: "/recipes/:id",
        loader: recipeLoader,
        element: <RecipeEditor readOnly />,
      },
      {
        path: "/recipes/:id/edit",
        loader: recipeLoader,
        element: <RecipeEditor />,
      },
      {
        path: "/ingredients",
        loader: ingredientsLoader,
        element: <Ingredients />,
      },
      {
        path: "/containers",
        loader: containersLoader,
        element: <Containers />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
