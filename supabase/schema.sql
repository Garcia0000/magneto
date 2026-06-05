-- Magneto: Attention-to-Opportunity Platform
-- Run this in Supabase SQL Editor: https://<your-host>/project/default/sql/new

-- ── Sessions ──────────────────────────────────────────────────────────────────
-- One row per visitor. Groups all events from a single visit.

CREATE TABLE IF NOT EXISTS sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip            TEXT,
  ua            TEXT,
  source        TEXT,                          -- UTM source (facebook, google, tiktok, organic)
  campaign_id   UUID,
  intent_score  INT         NOT NULL DEFAULT 0,  -- 0-100
  intent_level  TEXT        NOT NULL DEFAULT 'cold', -- cold | warm | hot
  max_watch_pct INT         NOT NULL DEFAULT 0,  -- highest watch depth milestone hit
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Events ────────────────────────────────────────────────────────────────────
-- All tracking events (play, watch_depth milestones, CTA clicks, tab changes)

CREATE TABLE IF NOT EXISTS events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID        REFERENCES sessions(id) ON DELETE SET NULL,
  event           TEXT        NOT NULL, -- play | autoplay | watch_depth | cta_click | tab_blur | tab_focus | exit_intent
  player          TEXT,
  cta_text        TEXT,
  seconds_watched INT,
  watch_pct       INT,                  -- 10/25/50/75/90/100 — only for watch_depth events
  ts              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Leads ─────────────────────────────────────────────────────────────────────
-- Form submissions = Oportunidades

CREATE TABLE IF NOT EXISTS leads (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        REFERENCES sessions(id) ON DELETE SET NULL,
  name          TEXT,
  contact       TEXT,                   -- WhatsApp with country code
  intent_score  INT         DEFAULT 0,
  intent_level  TEXT        DEFAULT 'warm',
  stage         TEXT        NOT NULL DEFAULT 'oportunidad', -- oportunidad | venta
  ip            TEXT,
  ua            TEXT,
  ts            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Campaigns ─────────────────────────────────────────────────────────────────
-- Track ad spend per campaign/period

CREATE TABLE IF NOT EXISTS campaigns (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  source        TEXT,                   -- facebook | google | tiktok | organic | email
  ad_spend      NUMERIC(12,2) NOT NULL DEFAULT 0,
  period_start  DATE,
  period_end    DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Deals ─────────────────────────────────────────────────────────────────────
-- Closed sales (manual entry)

CREATE TABLE IF NOT EXISTS deals (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id   UUID        REFERENCES leads(id) ON DELETE SET NULL,
  value     NUMERIC(12,2),
  notes     TEXT,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_events_session  ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_ts       ON events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_event    ON events(event);
CREATE INDEX IF NOT EXISTS idx_leads_ts        ON leads(ts DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_ts     ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_intent ON sessions(intent_level);
