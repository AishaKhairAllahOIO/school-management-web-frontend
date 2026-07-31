# Scheduling UI upgrade

## Install

The export buttons generate real `.xlsx` files:

```bash
npm install xlsx
```

## Mock/API switch

- `catalog/api/scheduling-catalog.api.ts` imports current grades, classrooms, subjects, teachers and the active academic year.
- `class-schedules/api/class-schedules.api.ts` handles schedule CRUD.
- Both currently use mock data through `USE_MOCK_API = true`.
- Set it to `false` and update the documented endpoint when the backend routes are ready.

No page component needs to change when switching from mock data to the API.
