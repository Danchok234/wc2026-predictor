-- WC2026 Playoff Predictor — schema
-- Run this once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create type round_type as enum ('R32', 'R16', 'QF', 'SF', 'Final');
create type player_type as enum ('danya', 'dima');
create type match_status as enum ('upcoming', 'locked', 'finished');

create table matches (
  id uuid primary key default gen_random_uuid(),
  round round_type not null,
  match_number int not null,
  home_team text,
  away_team text,
  home_slot text,
  away_slot text,
  match_date timestamptz not null,
  actual_home_score int,
  actual_away_score int,
  actual_winner text,
  status match_status not null default 'upcoming',
  feeds_match_id uuid references matches(id),
  feeds_slot text check (feeds_slot in ('home', 'away')),
  created_at timestamptz not null default now(),
  unique (round, match_number)
);

create table predictions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id),
  player player_type not null,
  predicted_home_score int not null check (predicted_home_score >= 0),
  predicted_away_score int not null check (predicted_away_score >= 0),
  predicted_winner_side text not null check (predicted_winner_side in ('home', 'away')),
  submitted_at timestamptz not null default now(),
  unique (match_id, player)
);

create index idx_predictions_match on predictions(match_id);
create index idx_matches_round on matches(round);

alter table matches enable row level security;
alter table predictions enable row level security;

-- Matches: readable by anyone (anon key), writes only via service role (admin API route).
create policy "matches are readable by everyone"
  on matches for select
  using (true);

-- Predictions: readable by everyone (visibility logic enforced in the app layer),
-- insert allowed for everyone (player identity enforced in the app layer via PIN),
-- no update, no delete — predictions are permanent.
create policy "predictions are readable by everyone"
  on predictions for select
  using (true);

create policy "predictions can be inserted by everyone"
  on predictions for insert
  with check (true);

-- Explicitly: no update/delete policies exist, so those operations are denied by RLS.

-- Seed the 31 knockout matches with placeholder slots and real dates.
-- Round of 32 — July 1–6, 2026
insert into matches (round, match_number, home_slot, away_slot, match_date) values
('R32', 1, '1A', '2C', '2026-07-01 17:00:00+00'),
('R32', 2, '1B', '2D', '2026-07-01 21:00:00+00'),
('R32', 3, '1C', '2A', '2026-07-02 17:00:00+00'),
('R32', 4, '1D', '2B', '2026-07-02 21:00:00+00'),
('R32', 5, '1E', '2G', '2026-07-03 17:00:00+00'),
('R32', 6, '1F', '2H', '2026-07-03 21:00:00+00'),
('R32', 7, '1G', '2E', '2026-07-04 17:00:00+00'),
('R32', 8, '1H', '2F', '2026-07-04 21:00:00+00'),
('R32', 9, '1I', '2K', '2026-07-05 17:00:00+00'),
('R32', 10, '1J', '2L', '2026-07-05 21:00:00+00'),
('R32', 11, '1K', '2I', '2026-07-06 17:00:00+00'),
('R32', 12, '1L', '2J', '2026-07-06 21:00:00+00'),
('R32', 13, '3rd-1', '3rd-2', '2026-07-05 14:00:00+00'),
('R32', 14, '3rd-3', '3rd-4', '2026-07-05 18:00:00+00'),
('R32', 15, '3rd-5', '3rd-6', '2026-07-06 14:00:00+00'),
('R32', 16, '3rd-7', '3rd-8', '2026-07-06 18:00:00+00');

-- Round of 16 — July 8–11, 2026 (teams TBD until R32 finishes)
insert into matches (round, match_number, match_date) values
('R16', 1, '2026-07-08 17:00:00+00'),
('R16', 2, '2026-07-08 21:00:00+00'),
('R16', 3, '2026-07-09 17:00:00+00'),
('R16', 4, '2026-07-09 21:00:00+00'),
('R16', 5, '2026-07-10 17:00:00+00'),
('R16', 6, '2026-07-10 21:00:00+00'),
('R16', 7, '2026-07-11 17:00:00+00'),
('R16', 8, '2026-07-11 21:00:00+00');

-- Quarter-finals — July 14–15, 2026
insert into matches (round, match_number, match_date) values
('QF', 1, '2026-07-14 17:00:00+00'),
('QF', 2, '2026-07-14 21:00:00+00'),
('QF', 3, '2026-07-15 17:00:00+00'),
('QF', 4, '2026-07-15 21:00:00+00');

-- Semi-finals — July 18–19, 2026
insert into matches (round, match_number, match_date) values
('SF', 1, '2026-07-18 21:00:00+00'),
('SF', 2, '2026-07-19 21:00:00+00');

-- Final — July 26, 2026
insert into matches (round, match_number, match_date) values
('Final', 1, '2026-07-26 18:00:00+00');
