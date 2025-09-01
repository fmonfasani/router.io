import { users, endpoints, logs, leads } from "./schema";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type User = import("drizzle-orm").InferSelectModel<typeof users>;
export type NewUser = import("drizzle-orm").InferInsertModel<typeof users>;

export type Endpoint = import("drizzle-orm").InferSelectModel<typeof endpoints>;
export type NewEndpoint = import("drizzle-orm").InferInsertModel<typeof endpoints>;

export type Log = import("drizzle-orm").InferSelectModel<typeof logs>;
export type NewLog = import("drizzle-orm").InferInsertModel<typeof logs>;

export type Lead = import("drizzle-orm").InferSelectModel<typeof leads>;
export type NewLead = import("drizzle-orm").InferInsertModel<typeof leads>;
