# UC023 — Wireframe

## Shared Layout: /admin/\*

```
+---------------------------------------------------+
| Admin Panel                                       |
+-------------------+-------------------------------+
| Sidebar           | Main content                   |
| - Overview        | <h1>Page title</h1>            |
| - Bars            | ...                            |
| - Reviews         |                                |
| - Users           |                                |
| - Blog            |                                |
| - Staff           |                                |
+-------------------+-------------------------------+
```

## /admin (overview)

```
Stats cards:
- Total bars
- Pending bars
- Total users
- Total reviews
- Pending reviews
- Total blog posts
```

## /admin/bars

```
Table/list:
- Name, Slug, Approved?, Deleted?
Actions:
- Approve / Reject (pending)
- Delete
- Edit link
```

## /admin/reviews

```
Table/list:
- Bar, User, Rating, Approved?
Actions:
- Approve / Reject
- Delete
```

## /admin/users

```
Table/list:
- Email, Name, Role, Status
Actions:
- Change role (select)
- Delete
```

## /admin/blog

```
Table/list:
- Title, Slug, Published?
Actions:
- Publish / Unpublish
- Delete
```

## /admin/staff

```
Table/list:
- Display name, Slug, Approved?
Actions:
- Approve / Reject
- Delete
```
