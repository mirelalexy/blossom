-- extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================= USERS =================
CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	display_name VARCHAR(100) NOT NULL DEFAULT 'User',
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	avatar TEXT,
	banner TEXT,
	theme VARCHAR(50) NOT NULL DEFAULT 'blossom',
	currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
	level INTEGER DEFAULT 1,
	xp INTEGER NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================= CATEGORIES =================
CREATE TABLE categories (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name VARCHAR(100) NOT NULL,
	icon VARCHAR(50) NOT NULL DEFAULT 'circle',
	type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
	is_default BOOLEAN NOT NULL DEFAULT FALSE,

	UNIQUE(user_id, name, type)
);

-- ================= TRANSACTIONS =================
CREATE TABLE transactions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	category_id UUID NOT NULL REFERENCES categories(id),
	amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
	type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
	method VARCHAR(10) NOT NULL CHECK (method IN ('card', 'cash')),
	title VARCHAR(255) NOT NULL,
	notes TEXT,
	date DATE NOT NULL,
	mood VARCHAR(20) CHECK (mood IN ('happy', 'calm', 'neutral', 'anxious', 'sad')),
	intent VARCHAR(20) CHECK (intent IN ('necessary', 'planned', 'impulse')),
	is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
	recur_frequency VARCHAR(10) CHECK (recur_frequency IN ('weekly', 'monthly')),
	recur_day_of_month SMALLINT CHECK (recur_day_of_month BETWEEN 1 AND 31),
	recur_day_of_week SMALLINT CHECK (recur_day_of_week BETWEEN 0 AND 6),
	recurring_parent_id UUID,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	CHECK (
		(is_recurring = false AND recur_frequency IS NULL AND recur_day_of_month IS NULL AND recur_day_of_week IS NULL)
		OR
		(is_recurring = true AND recur_frequency IS NOT NULL)
	)
);

-- ================= GOALS =================
CREATE TABLE goals (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name VARCHAR(255) NOT NULL,
	target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
	current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0 AND current_amount <= target_amount),
	deadline DATE NOT NULL,
	notes TEXT,
	link TEXT,
	saving_mode VARCHAR(10) NOT NULL DEFAULT 'auto' CHECK (saving_mode IN ('auto', 'manual')),
	is_primary BOOLEAN NOT NULL DEFAULT FALSE,
	is_completed BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_auto_deposit_month DATE
);

-- ================= BUDGETS =================
CREATE TABLE budgets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
	monthly_limit NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (monthly_limit >= 0),
	rollover VARCHAR(20) NOT NULL DEFAULT 'none' CHECK (rollover IN ('none', 'next_month', 'primary_goal')),
	budget_structure VARCHAR(20) NOT NULL DEFAULT 'total' CHECK (budget_structure IN ('total', 'category')),
	last_rollover_month DATE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================= CATEGORY BUDGETS =================
CREATE TABLE category_budgets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	monthly_limit NUMERIC(12, 2) NOT NULL CHECK (monthly_limit >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	UNIQUE(user_id, category_id)
);

-- ================= RULES =================
CREATE TABLE rules (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	type VARCHAR(20) NOT NULL CHECK (type IN ('single_limit', 'weekly_count')),
	value NUMERIC(12, 2) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	UNIQUE(user_id, category_id, type)
);

-- ================= NOTIFICATION SETTINGS =================
CREATE TABLE notification_settings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
	near_budget BOOLEAN NOT NULL DEFAULT TRUE,
	exceed_budget BOOLEAN NOT NULL DEFAULT TRUE,
	level_up BOOLEAN NOT NULL DEFAULT TRUE,
	challenge_complete BOOLEAN NOT NULL DEFAULT TRUE,
	log_reminder BOOLEAN NOT NULL DEFAULT TRUE,
	recurring_reminder BOOLEAN NOT NULL DEFAULT TRUE,
	recurring_frequency VARCHAR(20) NOT NULL DEFAULT 'monthly' CHECK (recurring_frequency IN ('weekly', 'monthly'))
);

-- ================= NOTIFICATIONS =================
CREATE TABLE notifications (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	message TEXT NOT NULL,
	event_key TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_notification ON notifications (user_id, event_key);

-- ================= CHALLENGES =================
CREATE TABLE challenges (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	type VARCHAR(20) NOT NULL,
	target NUMERIC NOT NULL,
	progress NUMERIC NOT NULL DEFAULT 0,
	completed BOOLEAN NOT NULL DEFAULT FALSE,
	period VARCHAR(10) NOT NULL CHECK (period IN ('weekly', 'monthly')),
	mood_type TEXT,
	method_type TEXT,
	intent_type TEXT,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================= TASKS =================
CREATE TABLE tasks (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(255) NOT NULL,
	completed BOOLEAN NOT NULL DEFAULT FALSE,
	completed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- ================= REWARDS =================
CREATE TABLE rewards (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
	title VARCHAR(255) NOT NULL,
	link TEXT,
	claimed BOOLEAN NOT NULL DEFAULT FALSE,
	claimed_at TIMESTAMPTZ,
	amount NUMERIC,
	transaction_id UUID,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_task_id ON rewards(task_id);