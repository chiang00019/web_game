# Game Management Module Refactoring Plan

This document outlines the plan for refactoring the game management module of the web game shop.

## 1. Database Schema

The following SQL statements define the database schema for the game management module.

```sql
-- Create the games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the game_options table
CREATE TABLE game_options (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the game_tags table to associate games with tags
CREATE TABLE game_tags (
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, tag_id)
);
```

These tables will be added to `db.sql`.

## 2. API Routes

The following API routes will be created to handle the CRUD operations for games, game options, and game tags.

-   **Games**
    -   `GET /api/games`: Get a list of all games.
    -   `GET /api/games/:id`: Get a single game by ID.
    -   `POST /api/games`: Create a new game.
    -   `PUT /api/games/:id`: Update a game by ID.
    -   `DELETE /api/games/:id`: Delete a game by ID.
-   **Game Options**
    -   `GET /api/games/:id/options`: Get all options for a game.
    -   `POST /api/games/:id/options`: Create a new option for a game.
    -   `PUT /api/games/:id/options/:option_id`: Update a game option.
    -   `DELETE /api/games/:id/options/:option_id`: Delete a game option.
-   **Game Tags**
    -   `GET /api/tags`: Get a list of all tags.
    -   `POST /api/games/:id/tags`: Add a tag to a game.
    -   `DELETE /api/games/:id/tags/:tag_id`: Remove a tag from a game.

## 3. Admin Interface

The following pages and components will be created for the admin interface.

-   **Pages**
    -   `client/src/app/admin/games/page.tsx`: A page to display a list of all games with filtering and sorting options.
    -   `client/src/app/admin/games/new/page.tsx`: A page with a form to create a new game.
    -   `client/src/app/admin/games/[id]/edit/page.tsx`: A page with a form to edit an existing game.
-   **Components**
    -   `client/src/components/admin/GameForm.tsx`: A form component for creating and editing games.
    -   `client/src/components/admin/GameList.tsx`: A component to display a list of games.
    -   `client/src/components/admin/GameOptionsForm.tsx`: A form component for managing game options.
    -   `client/src/components/admin/GameTagsForm.tsx`: A form component for managing game tags.

## 4. Shop Interface

The following pages and components will be created for the shop interface.

-   **Pages**
    -   `client/src/app/page.tsx`: The home page will be updated to display a list of popular games.
    -   `client/src/app/shop/page.tsx`: The main shop page will display a list of all games with filtering and sorting options.
    -   `client/src/app/shop/[id]/page.tsx`: A page to display the details of a single game, including its options.
-   **Components**
    -   `client/src/components/shop/GameCard.tsx`: A component to display a game card with its name, icon, and tags.
    -   `client/src/components/shop/GameDetails.tsx`: A component to display the details of a game, including its options.

## 5. Files to be Modified

The following files will be modified as part of this refactoring.

-   `db.sql`: Add the new tables for games, game options, and tags.
-   `client/src/app/page.tsx`: Update the home page to display popular games.
-   `client/src/app/admin/games/page.tsx`: Create a new page to manage games.
-   `client/src/app/admin/games/new/page.tsx`: Create a new page to add a new game.
-   `client/src/app/admin/games/[id]/edit/page.tsx`: Create a new page to edit a game.
-   `client/src/app/shop/page.tsx`: Update the shop page to display all games.
-   `client/src/app/shop/[id]/page.tsx`: Create a new page to display game details.
-   `client/src/components/admin/GameForm.tsx`: Create a new component for the game form.
-   `client/src/components/admin/GameList.tsx`: Create a new component to list games.
-   `client/src/components/shop/GameCard.tsx`: Create a new component for the game card.
-   `client/src/components/shop/GameDetails.tsx`: Create a new component for the game details.
-   `client/src/api/games/route.ts`: Create a new API route for games.
-   `client/src/api/games/[id]/route.ts`: Create a new API route for a single game.
-   `client/src/api/games/[id]/options/route.ts`: Create a new API route for game options.
-   `client/src/api/games/[id]/tags/route.ts`: Create a new API route for game tags.
-   `client/src/api/tags/route.ts`: Create a new API route for tags.
