# Security Specification - ZaZu Digital Media

## 1. Data Invariants
1. Only authenticated users can access and modify their own `/users/{userId}` record. Users cannot self-escalate to `role: 'admin'`.
2. Admin permissions are granted if the user email matches trusted bootstrapped agency admins (`eladigitalw@gmail.com`, `digitalmediazazu@gmail.com`) or exists in `/admins/{uid}` or has verified admin role.
3. Visitors can create `/inquiries` (contact forms) and `/bookings` (consultations) with validated size and type fields.
4. Only Admins can create, update, or delete `/projects`, `/services`, `/pricing`, `/testimonials`, `/blogPosts`, and `/settings`.
5. Public visitors can read published `/projects`, active `/services`, `/pricing`, `/testimonials`, published `/blogPosts`, and public `/settings`.
6. Only admins can read, list, and update status on `/inquiries` and `/bookings`.
7. Client data and PII (inquiries/bookings) cannot be listed or read by anonymous or standard non-admin users.

## 2. The Dirty Dozen Security Payloads (Rejected by Rules)
1. Unauthorized project deletion by unauthenticated user.
2. Injected ghost fields in project update (`{ hack: true }`).
3. Escalating standard user role to admin via profile update (`{ role: 'admin' }`).
4. Read of sensitive contact inquiries by unauthenticated or non-admin client.
5. Injected 2MB oversized payload into inquiry message.
6. Spoofed email address attempting admin bypass without authentication token.
7. Unauthenticated update to agency pricing or services.
8. Deletion of client inquiries by non-admin.
9. Writing unpublished/draft blog posts by unauthorized users.
10. Malformed ID paths (`/projects/../../hack`).
11. Bypassing booking creation schema with missing required contact details.
12. Overwriting immortal timestamp fields or ID fields.
