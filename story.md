# Smart Bookmark & Resource Manager — Product Story & Specifications

## 1. Project Overview

A centralized web application designed to solve the common developer struggle of losing valuable links (articles, documentation, videos) across chat apps like Telegram. It acts as a hybrid between a **Resource Hub** and a **Task Tracker**, allowing users to save, organize, track, and manage links efficiently.

---

## 2. Core Modules & User Journey

### A. Dashboard / Home

* **Purpose:** Provides a high-level overview and quick metrics (computed stats) to gamify and simplify the user experience.
* **Key Metrics:**
* Total links saved.
* Links marked as finished/completed.
* Links saved/visited this week.
* Unvisited or pending resources.


* **Shortcuts:** Quick navigation buttons to "Add New Link" or browse groups.

### B. Group (Category) Management

* **Purpose:** Organizes bookmarks into logical categories/groups (e.g., Angular, Backend, Devops).
* **Features:**
* Full CRUD support for groups (Create, Read, Update, Delete).
* **Scoped Navigation (Smart UX):** Clicking on a group card redirects the user directly to the Links/Search page, automatically pre-filtered to show only bookmarks belonging to that specific group.



### C. Links & Search Hub (Main Workspace)

* **Purpose:** The central place to view, search, and manage all saved resources.
* **Features:**
* **Advanced Search & Filters:** Instant search bar combined with filters for status (Finished/Pending) and group categories.
* **Multi-URL Support per Topic:** A single title/card can house *multiple individual links* (e.g., matching a topic with an official doc, a blog post, and a YouTube tutorial).
* **Card Actions:**
* **Copy Link Button:** One-click copy to clipboard for quick access.
* **Status Toggle:** Mark as Finished or Keep as To-Do.
* **Edit & Delete:** Full management of entries.
* **Auto-Visited Badge:** A subtle, clean "Visited" visual indicator that appears automatically when a user clicks/opens a link, separating it from the completion status.





### D. Add / Edit Link Flow

* **Purpose:** A dedicated form interface to input and structure new resources.
* **Fields:**
* Main Topic Title.
* Group/Category selection.
* Dynamic URL inputs (ability to add one or multiple links under the same title).
* Initial Status (To-Do / Finished).



---

## 3. Technical Highlights & Angular Features to Apply

* **State Management:** Reactive architecture using Angular **Signals** and **`computed()`** for instant dashboard calculations and filtering.
* **UI Interactivity:** Shared Modals using **`<ng-content>`** and **`model()`** for two-way binding.
* **Custom UI Enhancements:**
* **Custom Pipe:** Truncating long URLs or text descriptions.
* **Custom Directive:** Dynamic styling/badges for groups and visited states.


* **Backend:** Local persistence using **`json-server`** (mirroring a RESTful API structure with resources for bookmarks and groups).