# Trello Clone

A simplified Trello clone built using Next.js, React, TailwindCSS, and MongoDB. This project is a basic task and project management application that allows you to create boards, add lists, and manage tasks with features like drag-and-drop reordering and card modals.

## Features

* Board Management: Users can create, edit, and delete boards.
* List Management: Users can create, edit, delete, and reorder lists within boards.
* Card Management: Cards can be added, edited, deleted.
* Drag and Drop: Implemented for lists.
* Modal Popups: For editing card details such as title and description.
* Theme Switching: Users can switch between multiple themes (gradients).
* Posthog Integration: Metrics are tracked using Posthog for better product insights.

## File Structure

/src
  /components
    BoardCard.jsx          # Component for displaying board cards
    Card.jsx               # Card component for displaying individual tasks
    CardModal.jsx          # Modal to view and edit card details
    ListColumn.jsx         # Component for rendering each list and its cards
    Navbar.jsx             # Navigation bar component
    ThemeSwitcher.jsx      # Theme switcher component to change app theme

  /fonts
    GeistMonoVF.woff       # Font file for Geist Mono
    GeistVF.woff           # Font file for Geist

  /models
    Board.js               # Mongoose model for Board
    Card.js                # Mongoose model for Card
    List.js                # Mongoose model for List

  /pages
    _app.js                # App-level wrapper component, imports global styles
    index.js               # Homepage for displaying boards

    /api
      /boards.js           # API for handling board creation and retrieval
      /seed.js             # API to seed initial data for testing purposes

      /boards
        [boardId].js       # API for retrieving and modifying individual boards

      /boards/[boardId]
        board.js            # API for updating board details
        lists.js            # API for managing lists within a board

      /boards/[boardId]/lists
        reorder.js          # API for reordering lists in a board

      /boards/[boardId]/lists/[listId]
        cards.js            # API for managing cards in a list

      /boards/[boardId]/lists/[listId]/cards
        reorder.js          # API for reordering cards in a list

      /cards
        [cardId].js         # API for managing individual cards

      /lists
        [listId].js         # API for managing individual lists

      /lists/[listId]
        cards.js            # API for managing cards in a specific list

  /styles
    globals.css            # Global styles for the application

  /utils
    db.js                  # MongoDB connection utility for database access

/next.config.js            # Next.js configuration file
/package.json              # Project dependencies and scripts

## Features Walkthrough
* 1. Create Board
Users can create new boards from the homepage. Once created, boards are stored in the MongoDB database, and users can start adding lists to the board.

* 2. Create and Manage Lists
Users can create, rename, delete, and reorder lists within a board. Lists are managed via API calls, and the reordering functionality is handled with the drag-and-drop library react-beautiful-dnd.

* 3. Manage Cards
Cards can be created, edited, and deleted within a list. Each card has a title and description, which can be edited in a modal window. Cards can also be reordered within their respective lists.

* 4. Drag and Drop
Lists: Lists within a board can be reordered using drag-and-drop.
Cards: Cards within lists can be reordered and moved between lists.

* 5. Posthog Integration
Posthog is used for tracking key events within the application. We track actions such as creating boards, editing cards, reordering lists, and moving cards. These metrics are sent to Posthog for analysis, which helps us understand user behavior and improve the app based on data.



