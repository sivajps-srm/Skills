import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const activityResponses = sqliteTable("activity_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerName: text("learner_name").notNull(),
  sessionCode: text("session_code").notNull().default("WEDNESDAY-DEMO"),
  activity: text("activity").notNull(),
  response: text("response").notNull(),
  score: integer("score"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const triads = sqliteTable("triads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  createdBy: text("created_by").notNull(),
  sessionCode: text("session_code").notNull().default("WEDNESDAY-DEMO"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  round: integer("round").notNull().default(1),
  timerRemaining: integer("timer_remaining").notNull().default(480),
  timerEndsAt: integer("timer_ends_at"),
  timerRunning: integer("timer_running", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const triadMembers = sqliteTable("triad_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  triadCode: text("triad_code").notNull(),
  learnerName: text("learner_name").notNull(),
  role: text("role").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("triad_member_unique").on(table.triadCode, table.learnerName),
  uniqueIndex("triad_role_unique").on(table.triadCode, table.role),
]);

export const trainingSessions = sqliteTable("training_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  learnerCode: text("learner_code").notNull().unique(),
  pulseOpen: integer("pulse_open", { mode: "boolean" }).notNull().default(true),
  workbookOpen: integer("workbook_open", { mode: "boolean" }).notNull().default(true),
  cardsOpen: integer("cards_open", { mode: "boolean" }).notNull().default(true),
  roleplayOpen: integer("roleplay_open", { mode: "boolean" }).notNull().default(true),
  caseOpen: integer("case_open", { mode: "boolean" }).notNull().default(true),
  finishOpen: integer("finish_open", { mode: "boolean" }).notNull().default(true),
  deckOpen: integer("deck_open", { mode: "boolean" }).notNull().default(true),
  deckSlide: integer("deck_slide").notNull().default(0),
  promptVisible: integer("prompt_visible", { mode: "boolean" }).notNull().default(false),
  presentationClosed: integer("presentation_closed", { mode: "boolean" }).notNull().default(false),
  debriefResponseId: integer("debrief_response_id"),
  debriefVisible: integer("debrief_visible", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const journalEntries = sqliteTable("journal_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerName: text("learner_name").notNull(),
  sessionCode: text("session_code").notNull(),
  topic: text("topic").notNull(),
  entry: text("entry").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("journal_learner_topic_unique").on(table.learnerName, table.sessionCode, table.topic)]);
