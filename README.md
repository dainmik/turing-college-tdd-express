# REST API server for a movie ticket booking system

This is part of an exercise to practice:

- Test Driven Development
- Conventional Commits

For this exercise, the tech stack is:

- TypeScript
- Express.js
- Kysely with SQLite
- Zod
- Vitest
- supertest
- ESLint
- Prettier

## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Download database

We need to download the database first. Run the following command:

```bash
pnpm download-database
```

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```

## Technical requirements:

- Database schema changes must be done using migrations. You can adapt the provided database schema to match your needs by adding more tables or changing the existing ones.
- Application code should have unit and integration tests. Shoot for 80% - 95% test coverage.
- Commits should follow the Conventional Commits standard. Commit early, commit often.

## Movie Scenarios

### Scenario: Get movies by IDs

As a user,
I want to request a list of movies by providing a list of IDs,
So that I can view the title and release year of specific movies.

#### Acceptance Criteria:

- [ ] Given a list of valid movie IDs (`/movies?id=1,2,3`),
      When I send a GET request,
      Then I receive a list of movies with their `id`, `title`, and `year`.
- [ ] If any ID in the list does not exist,
      Then it is ignored in the response.
- [ ] If no valid IDs are provided,
      Then the response is an empty list.

## Screening Scenarios

### Scenario: Create a new screening (Admin)

As an admin,
I want to create a new screening for a movie,
So that users can book tickets to watch the movie.

#### Acceptance Criteria:

- [ ] I can provide a `movie_id`, a `timestamp`, and a `ticket_allocation`.
- [ ] The screening is created only if the `movie_id` exists.
- [ ] The `ticket_allocation` must be a positive integer.
- [ ] The `timestamp` must be in the future.
- [ ] A successful response returns 201 Created with screening info.

### Scenario: Delete an empty screening (Admin)

As an admin,
I want to delete a screening that has no tickets booked,
So I can clean up unused or incorrect screenings.

#### Acceptance Criteria:

- [ ] If a screening has 0 tickets booked, I can delete it.
- [ ] If a screening has 1 or more tickets booked, deletion is rejected (400 or 409).
- [ ] A successful delete returns 204 No Content.

### Scenario: Change screening ticket allocation (Admin)

As an admin,
I want to increase or decrease the number of available tickets for a screening,
So that the screening can adapt to room availability.

#### Acceptance Criteria:

- [ ] I can change the ticket allocation only if the new value is greater or equal to reserved tickets.
- [ ] A decrease below the number of already booked tickets is rejected (400).
- [ ] A successful update returns 200 OK with the updated allocation.

### Scenario: Get all available screenings (User)

As a user,
I want to see all available screenings,
So I can choose a session to book.

#### Acceptance Criteria:

- [ ] Each screening includes:
  - `timestamp`
  - `ticket_allocation`
  - `tickets_left`
  - `movie.title`
  - `movie.year`
- [ ] Only future screenings are shown (current or past ones excluded).
- [ ] A successful response returns 200 OK with a list of screenings.

## Ticket Scenarios

### Scenario: Book a ticket (User)

As a user,
I want to book tickets for a screening,
So I can reserve my spot to watch the movie.

#### Acceptance Criteria:

- [ ] I must provide a valid `screening_id` and `number_of_tickets` (default: 1).
- [ ] Bookings cannot be made for screenings in the past.
- [ ] Booking fails if the number of available tickets is insufficient (400).
- [ ] On success, the booked ticket(s) are associated with the user.
- [ ] A successful booking returns 201 Created with ticket(s) info.

### Scenario: Get my booked tickets (User)

As a user,
I want to see the tickets I have booked,
So I can track my screenings.

#### Acceptance Criteria:

- [ ] I receive a list of my tickets with:
  - `screening.timestamp`
  - `movie.title`
  - `movie.year`
  - `number_of_tickets`
- [ ] Only tickets belonging to me are returned.
- [ ] A successful response returns 200 OK with ticket data.
