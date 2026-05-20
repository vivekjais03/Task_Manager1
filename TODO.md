# TaskFlow - TODO

## Deploy readiness / feature fixes
- [x] Update frontend API baseURL for Render deployment (`client/src/utils/api.js`).
- [x] Verify seed logic in `server/seed.js` and run seed locally.
- [ ] Update Kanban admin task assignee list to show only members of the selected project.
  - [x] Add backend endpoint `GET /api/projects/:id/users`.
  - [x] Update `client/src/pages/projects/KanbanBoard.js` to use the new endpoint.
  - [ ] Push changes to GitHub.



